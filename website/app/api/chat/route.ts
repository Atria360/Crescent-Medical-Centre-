import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBlocks, getCollection, s, list } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Website FAQ assistant — a cost-sensitive, high-volume, short-answer public
// widget, so it defaults to Haiku. Override with CHAT_MODEL to upgrade.
const MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5";

type ChatMessage = { role: "user" | "assistant"; content: string };

interface Service { title: string; description: string }
interface TeamMember { name: string; credentials: string }
interface Faq { question: string; answer: string }

// Cache the assembled knowledge base briefly so a burst of chat traffic doesn't
// hammer Supabase for the same content on every message.
let cachedContext: { text: string; at: number } | null = null;
const CONTEXT_TTL_MS = 60_000;

async function buildContext(): Promise<string> {
  if (cachedContext && Date.now() - cachedContext.at < CONTEXT_TTL_MS) {
    return cachedContext.text;
  }

  const [blocks, services, team, faqs] = await Promise.all([
    getBlocks(["settings", "home_services", "uninsured_page"]),
    getCollection<Service>("services"),
    getCollection<TeamMember>("team_members"),
    getCollection<Faq>("faqs"),
  ]);
  const settings = blocks.settings;

  const hours = list(settings, "hours")
    .map((h) => h.line)
    .filter(Boolean)
    .join("; ");

  const parts: string[] = [];
  parts.push(`Clinic: ${s(settings, "site_name", "Crescent Medical Centre")}`);
  if (s(settings, "address")) parts.push(`Address: ${s(settings, "address")}`);
  if (s(settings, "phone")) parts.push(`Phone: ${s(settings, "phone")}`);
  if (s(settings, "toll_free")) parts.push(`Toll-free: ${s(settings, "toll_free")}`);
  if (s(settings, "email")) parts.push(`Email: ${s(settings, "email")}`);
  if (hours) parts.push(`Hours: ${hours}`);
  if (s(settings, "hours_note")) parts.push(`Hours note: ${s(settings, "hours_note")}`);

  if (services.length) {
    parts.push(
      "\nServices offered:\n" +
        services
          .map((x) => `- ${x.title}${x.description ? `: ${x.description}` : ""}`)
          .join("\n")
    );
  }
  if (team.length) {
    parts.push(
      "\nMedical team:\n" +
        team.map((x) => `- ${x.name}${x.credentials ? ` (${x.credentials})` : ""}`).join("\n")
    );
  }
  if (faqs.length) {
    parts.push(
      "\nFrequently asked questions:\n" +
        faqs.map((x) => `Q: ${x.question}\nA: ${x.answer}`).join("\n\n")
    );
  }

  const text = parts.join("\n");
  cachedContext = { text, at: Date.now() };
  return text;
}

function systemPrompt(context: string): string {
  return `You are the friendly virtual assistant for Crescent Medical Centre, a family practice clinic in Calgary, Alberta. You answer questions from website visitors.

Use ONLY the clinic information below to answer. If the information needed isn't there, say you don't have that detail and invite the visitor to call the clinic or use the contact form — do not guess or make up hours, prices, doctors, or policies.

Rules:
- Be warm, concise, and helpful. Keep answers to a few sentences.
- You are NOT a doctor. Never diagnose, interpret symptoms, or give medical advice. For health concerns, direct the visitor to book an appointment or call.
- For anything urgent or an emergency, tell them to call 911 immediately.
- Encourage booking an appointment (the clinic welcomes walk-ins and same-day appointments) and share the phone number when relevant.
- Only discuss this clinic. Politely decline unrelated requests.

--- CLINIC INFORMATION ---
${context}
--- END CLINIC INFORMATION ---`;
}

function fallbackReply(phone: string): string {
  const call = phone ? ` call us at ${phone}` : " call the clinic";
  return `Our chat assistant isn't available right now. Please${call} or use the contact form and we'll be happy to help.`;
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = (await req.json()) as { messages?: ChatMessage[] };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  // Keep the last few turns, drop empties, and cap length to bound token use.
  const messages: ChatMessage[] = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .filter((m) => m.content.trim().length > 0);

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const blocks = await getBlocks(["settings"]);
    return NextResponse.json({ reply: fallbackReply(s(blocks.settings, "phone")) });
  }

  try {
    const context = await buildContext();
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [{ type: "text", text: systemPrompt(context), cache_control: { type: "ephemeral" } }],
      messages,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return NextResponse.json({ reply: reply || "Sorry, I didn't catch that — could you rephrase?" });
  } catch {
    const blocks = await getBlocks(["settings"]);
    return NextResponse.json({ reply: fallbackReply(s(blocks.settings, "phone")) });
  }
}

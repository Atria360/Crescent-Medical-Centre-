import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCollection } from "@/lib/content";
import { getLocation, getPrimaryLocation, type Location } from "@/lib/locations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Website FAQ assistant — a cost-sensitive, high-volume, short-answer public
// widget, so it defaults to Haiku. Override with CHAT_MODEL to upgrade.
const MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5";

type ChatMessage = { role: "user" | "assistant"; content: string };

interface Service { title: string; description: string }
interface TeamMember { name: string; credentials: string }
interface Faq { question: string; answer: string }

// Cache each location's assembled knowledge base briefly so a burst of chat
// traffic doesn't hammer Supabase for the same content on every message.
const contextCache = new Map<string, { text: string; name: string; at: number }>();
const CONTEXT_TTL_MS = 60_000;

async function resolveLocation(slug?: string): Promise<Location | null> {
  if (slug) {
    const loc = await getLocation(slug);
    if (loc) return loc;
  }
  return getPrimaryLocation();
}

async function buildContext(loc: Location): Promise<string> {
  const cached = contextCache.get(loc.slug);
  if (cached && Date.now() - cached.at < CONTEXT_TTL_MS) return cached.text;

  const [services, team, faqs] = await Promise.all([
    getCollection<Service>("services", { location: loc.slug }),
    getCollection<TeamMember>("team_members", { location: loc.slug }),
    getCollection<Faq>("faqs", { location: loc.slug }),
  ]);

  const hours = (loc.hours ?? []).map((h) => h.line).filter(Boolean).join("; ");

  const parts: string[] = [];
  parts.push(`Clinic: ${loc.name} — ${loc.area} location`);
  if (loc.address) parts.push(`Address: ${loc.address}`);
  if (loc.phone) parts.push(`Phone: ${loc.phone}`);
  if (loc.toll_free) parts.push(`Toll-free: ${loc.toll_free}`);
  if (loc.email) parts.push(`Email: ${loc.email}`);
  if (hours) parts.push(`Hours: ${hours}`);
  if (loc.hours_note) parts.push(`Hours note: ${loc.hours_note}`);

  if (services.length) {
    parts.push(
      "\nServices offered:\n" +
        services.map((x) => `- ${x.title}${x.description ? `: ${x.description}` : ""}`).join("\n")
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
  contextCache.set(loc.slug, { text, name: `${loc.name} — ${loc.area}`, at: Date.now() });
  return text;
}

function systemPrompt(clinic: string, context: string): string {
  return `You are the friendly virtual assistant for ${clinic}, a family practice clinic in Calgary, Alberta. You answer questions from visitors to this specific clinic location's website.

Use ONLY the clinic information below to answer. If the information needed isn't there, say you don't have that detail and invite the visitor to call the clinic or use the contact form — do not guess or make up hours, prices, doctors, or policies. This information is for the ${clinic} location only; do not answer for any other location.

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
  let body: { messages?: ChatMessage[]; location?: string };
  try {
    body = (await req.json()) as { messages?: ChatMessage[]; location?: string };
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

  const loc = await resolveLocation(body.location);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(loc?.phone ?? "") });
  }

  try {
    if (!loc) throw new Error("no location");
    const context = await buildContext(loc);
    const clinic = `${loc.name} — ${loc.area}`;
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        { type: "text", text: systemPrompt(clinic, context), cache_control: { type: "ephemeral" } },
      ],
      messages,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return NextResponse.json({ reply: reply || "Sorry, I didn't catch that — could you rephrase?" });
  } catch {
    return NextResponse.json({ reply: fallbackReply(loc?.phone ?? "") });
  }
}

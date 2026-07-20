import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getBlock, s } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const subject = (body.subject ?? "Contact form").trim() || "Contact form";
  const message = (body.message ?? "").trim();

  if (!name || !email || !phone) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  // 1. Store the message so it always lands in the admin inbox, even if email
  //    delivery is misconfigured.
  const supabase = createPublicClient();
  const { error: dbError } = await supabase
    .from("messages")
    .insert({ subject, name, email, phone, message });

  // 2. Notify the clinic by email.
  const settings = await getBlock("settings");
  const to = process.env.CONTACT_TO_EMAIL || s(settings, "form_email") || s(settings, "email");

  let emailed = false;
  if (to) {
    try {
      emailed = await sendEmail({ to, name, email, phone, subject, message });
    } catch {
      emailed = false;
    }
  }

  // Succeed as long as the enquiry was captured somewhere reachable.
  if (dbError && !emailed) {
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please call us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

async function sendEmail(p: {
  to: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const text =
    `New enquiry from the website\n\n` +
    `Subject: ${p.subject}\n` +
    `Name:    ${p.name}\n` +
    `Email:   ${p.email}\n` +
    `Phone:   ${p.phone}\n\n` +
    `Message:\n${p.message || "(none)"}\n`;

  // Preferred path: Resend (set RESEND_API_KEY, and CONTACT_FROM_EMAIL once a
  // sending domain is verified). Sent server-side so the key is never exposed.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Crescent Medical <onboarding@resend.dev>",
        to: [p.to],
        reply_to: p.email,
        subject: `Website enquiry: ${p.subject}`,
        text,
      }),
    });
    return res.ok;
  }

  // Zero-config fallback: FormSubmit relays the enquiry to `to` by email.
  // The very first submission triggers a one-time confirmation email to that
  // inbox; click the link once and every later submission is delivered.
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(p.to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `Website enquiry: ${p.subject}`,
      _template: "table",
      name: p.name,
      email: p.email,
      phone: p.phone,
      subject: p.subject,
      message: p.message || "(none)",
    }),
  });
  return res.ok;
}

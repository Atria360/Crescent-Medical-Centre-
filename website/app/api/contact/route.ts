import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getBlock } from "@/lib/content";
import { getLocation } from "@/lib/locations";
import { isValidEmail, resolveRecipients, sendEnquiry } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  location?: string;
};

// Bound what a single submission can push into the database and the email body.
const LIMITS = { name: 120, email: 160, phone: 40, subject: 120, message: 5000 };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const subject = clean(body.subject, LIMITS.subject) || "Contact form";
  const message = clean(body.message, LIMITS.message);
  const location = clean(body.location, 64) || null;

  if (!name || !email || !phone) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // 1. Work out which inbox this clinic's enquiries go to. The location's own
  //    form_email wins — see resolveRecipients for the full order.
  const [settings, loc] = await Promise.all([
    getBlock("settings"),
    location ? getLocation(location) : Promise.resolve(null),
  ]);
  const { to } = resolveRecipients(loc, settings, process.env.CONTACT_TO_EMAIL ?? "");

  // 2. Send it. Never let a provider failure throw past this point — the
  //    enquiry still has to reach the admin inbox in step 3.
  let delivery;
  try {
    delivery = await sendEnquiry(to, {
      name,
      email,
      phone,
      subject,
      message,
      area: loc?.area,
    });
  } catch {
    delivery = {
      delivered: false,
      deliveredTo: [] as string[],
      error: "Unexpected error while sending the notification email.",
      provider: "none" as const,
    };
  }

  // 3. Always record the enquiry, stamped with the clinic it came from and
  //    whether the email actually went out, so a misrouted or unconfirmed
  //    address is visible in Admin → Messages instead of failing silently.
  const supabase = createPublicClient();
  const { error: dbError } = await supabase.from("messages").insert({
    subject,
    name,
    email,
    phone,
    message,
    location,
    delivered: delivery.delivered,
    // On failure, record the address we *tried*, so a misconfigured recipient
    // is diagnosable from the inbox rather than invisible.
    delivered_to: (delivery.delivered ? delivery.deliveredTo : to).join(", "),
    delivery_error: delivery.error.slice(0, 500),
  });

  // Only a true dead end — neither emailed nor stored — is reported as failure.
  if (dbError && !delivery.delivered) {
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please call us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

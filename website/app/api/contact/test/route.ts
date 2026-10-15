import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBlock } from "@/lib/content";
import { getLocation } from "@/lib/locations";
import { resolveRecipients, sendEnquiry } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: send a test enquiry to a location's configured recipient so staff
 * can confirm the address works before a real patient relies on it. Matters
 * most on the FormSubmit fallback, where a brand-new address receives nothing
 * until someone clicks its one-time activation email.
 */
export async function POST(req: Request) {
  // Middleware guards /admin pages but not /api, so check the session here.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  let slug = "";
  try {
    const body = (await req.json()) as { location?: string };
    slug = (body.location ?? "").trim().slice(0, 64);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ ok: false, error: "No location given" }, { status: 400 });
  }

  const [settings, loc] = await Promise.all([getBlock("settings"), getLocation(slug)]);
  if (!loc) {
    return NextResponse.json({ ok: false, error: "Unknown location" }, { status: 404 });
  }

  const { to, source } = resolveRecipients(loc, settings, process.env.CONTACT_TO_EMAIL ?? "");
  if (to.length === 0) {
    return NextResponse.json({
      ok: false,
      to: [],
      source,
      error: "No valid recipient email is set for this location. Add one above and save.",
    });
  }

  const delivery = await sendEnquiry(to, {
    name: "Website test",
    email: user.email ?? "noreply@example.com",
    phone: "—",
    subject: "Test — contact form routing",
    message:
      `This is a test message sent from the Crescent Medical Centre admin panel by ${user.email ?? "an admin"}.\n\n` +
      `If you received it, enquiries from the ${loc.area} clinic's contact form will reach this inbox.`,
    area: loc.area,
  });

  return NextResponse.json({
    ok: delivery.delivered,
    to: delivery.delivered ? delivery.deliveredTo : to,
    source,
    provider: delivery.provider,
    error: delivery.error,
  });
}

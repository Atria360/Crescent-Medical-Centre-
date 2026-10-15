import type { BlockData } from "@/lib/content";
import type { Location } from "@/lib/locations";
import { parseRecipients } from "@/lib/email-address";

export { isValidEmail, parseRecipients } from "@/lib/email-address";

// Local string accessor so this module needs no runtime import from lib/content
// (which would pull the Supabase client into anything that imports it).
function str(block: BlockData, key: string): string {
  const v = block[key];
  return typeof v === "string" ? v : "";
}

export type RecipientSource =
  | "location.form_email"
  | "location.email"
  | "settings.form_email"
  | "settings.email"
  | "env.CONTACT_TO_EMAIL"
  | "none";

export interface ResolvedRecipients {
  to: string[];
  source: RecipientSource;
}

/**
 * Work out where a location's enquiries should land.
 *
 * The location's own `form_email` always wins — that is the field clinic staff
 * edit in Admin → Locations & branding, and it is what makes each clinic's form
 * go to its own inbox. Everything below it is a safety net so an enquiry is
 * never silently dropped while an address is missing. `CONTACT_TO_EMAIL` is
 * last on purpose: as an override it would quietly send every location's mail
 * to one inbox, which is exactly the bug this ordering prevents.
 */
export function resolveRecipients(
  loc: Location | null,
  settings: BlockData,
  envFallback = ""
): ResolvedRecipients {
  const candidates: [RecipientSource, string][] = [
    ["location.form_email", loc?.form_email ?? ""],
    ["location.email", loc?.email ?? ""],
    ["settings.form_email", str(settings, "form_email")],
    ["settings.email", str(settings, "email")],
    ["env.CONTACT_TO_EMAIL", envFallback],
  ];

  for (const [source, raw] of candidates) {
    const to = parseRecipients(raw);
    if (to.length > 0) return { to, source };
  }
  return { to: [], source: "none" };
}

export interface Enquiry {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** Clinic label used to prefix the subject line, e.g. "Westbrook". */
  area?: string;
}

export interface DeliveryResult {
  delivered: boolean;
  /** Addresses the provider accepted (or was asked to deliver to). */
  deliveredTo: string[];
  error: string;
  provider: "resend" | "formsubmit" | "none";
}

const SEND_TIMEOUT_MS = 10_000;

function body(e: Enquiry): string {
  return (
    `New enquiry from the website\n\n` +
    (e.area ? `Clinic:  ${e.area}\n` : "") +
    `Subject: ${e.subject}\n` +
    `Name:    ${e.name}\n` +
    `Email:   ${e.email}\n` +
    `Phone:   ${e.phone}\n\n` +
    `Message:\n${e.message || "(none)"}\n`
  );
}

function subjectLine(e: Enquiry): string {
  return e.area ? `[${e.area}] Website enquiry: ${e.subject}` : `Website enquiry: ${e.subject}`;
}

/**
 * Email the enquiry to `to`. Resend is the preferred provider; FormSubmit is a
 * zero-config fallback that works without an API key but needs a one-time
 * confirmation click per recipient address.
 */
export async function sendEnquiry(to: string[], e: Enquiry): Promise<DeliveryResult> {
  if (to.length === 0) {
    return {
      delivered: false,
      deliveredTo: [],
      error: "No recipient email is configured for this location.",
      provider: "none",
    };
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) return sendViaResend(resendKey, to, e);
  return sendViaFormSubmit(to, e);
}

async function sendViaResend(
  apiKey: string,
  to: string[],
  e: Enquiry
): Promise<DeliveryResult> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Crescent Medical <onboarding@resend.dev>",
        to,
        reply_to: e.email,
        subject: subjectLine(e),
        text: body(e),
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (res.ok) {
      return { delivered: true, deliveredTo: to, error: "", provider: "resend" };
    }
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    return {
      delivered: false,
      deliveredTo: [],
      error: `Resend rejected the message (HTTP ${res.status}). ${detail}`.trim(),
      provider: "resend",
    };
  } catch (err) {
    return {
      delivered: false,
      deliveredTo: [],
      error: `Resend request failed: ${errText(err)}`,
      provider: "resend",
    };
  }
}

async function sendViaFormSubmit(to: string[], e: Enquiry): Promise<DeliveryResult> {
  // FormSubmit takes one recipient per request, so fan out and report honestly:
  // delivered if at least one address was accepted.
  const ok: string[] = [];
  const failures: string[] = [];

  for (const addr of to) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(addr)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subjectLine(e),
          _template: "table",
          ...(e.area ? { clinic: e.area } : {}),
          name: e.name,
          email: e.email,
          phone: e.phone,
          subject: e.subject,
          message: e.message || "(none)",
        }),
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      });
      if (res.ok) ok.push(addr);
      else failures.push(`${addr}: HTTP ${res.status}`);
    } catch (err) {
      failures.push(`${addr}: ${errText(err)}`);
    }
  }

  if (ok.length > 0) {
    return {
      delivered: true,
      deliveredTo: ok,
      error: failures.length ? `Some recipients failed — ${failures.join("; ")}` : "",
      provider: "formsubmit",
    };
  }
  return {
    delivered: false,
    deliveredTo: [],
    error:
      `FormSubmit could not deliver (${failures.join("; ")}). ` +
      `A new address must confirm FormSubmit's one-time activation email before it receives anything.`,
    provider: "formsubmit",
  };
}

function errText(err: unknown): string {
  if (err instanceof Error) return err.name === "TimeoutError" ? "timed out" : err.message;
  return "unknown error";
}

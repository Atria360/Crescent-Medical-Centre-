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
  provider: "smtp" | "resend" | "formsubmit" | "none";
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

  // Direct SMTP first: it sends from the clinic's own mailbox, so no third
  // party ever holds the patient's details. Resend and FormSubmit remain as
  // alternatives for whoever deploys this.
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return sendViaSmtp(to, e);

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) return sendViaResend(resendKey, to, e);
  return sendViaFormSubmit(to, e);
}

/**
 * Send through an ordinary SMTP mailbox — Gmail, Google Workspace, or any host
 * that speaks SMTP. This is the "WP Mail SMTP" approach: the clinic's own
 * account does the sending, nothing is relayed through a third-party service.
 *
 * For Gmail, SMTP_PASS must be a 16-character App Password (Google account →
 * Security → 2-Step Verification → App passwords), not the account password.
 *
 * Port 465 is the default and uses implicit TLS, so credentials are never sent
 * over an unencrypted connection. Port 587 upgrades via STARTTLS.
 */
async function sendViaSmtp(to: string[], e: Enquiry): Promise<DeliveryResult> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  // Gmail's submission port is 465 (implicit TLS). Microsoft 365 and most
  // other hosts only accept 587 (STARTTLS) — defaulting a custom host to 465
  // would just hang, so pick 587 for anything that isn't Gmail.
  const port = Number(process.env.SMTP_PORT || (host === "smtp.gmail.com" ? 465 : 587));
  const user = process.env.SMTP_USER as string;
  const pass = process.env.SMTP_PASS as string;
  const implicitTls = port === 465;

  try {
    // Imported lazily so the module stays usable (and bundlable) when no SMTP
    // credentials are configured.
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: implicitTls,
      // On 587/25 the session starts in the clear and upgrades. requireTLS
      // makes that upgrade mandatory, so the password can never be sent over
      // an unencrypted connection if a server fails to offer STARTTLS.
      requireTLS: !implicitTls,
      auth: { user, pass },
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: SEND_TIMEOUT_MS,
      greetingTimeout: SEND_TIMEOUT_MS,
      socketTimeout: SEND_TIMEOUT_MS,
    });

    const info = await transport.sendMail({
      // Gmail and Microsoft 365 both rewrite (or reject) a From that isn't the
      // authenticated account or a verified alias, so default to the account.
      from: process.env.SMTP_FROM || `Crescent Medical Centre <${user}>`,
      to,
      replyTo: e.email,
      subject: subjectLine(e),
      text: body(e),
    });

    const accepted = (info.accepted ?? []).map(String).filter(Boolean);
    const rejected = (info.rejected ?? []).map(String).filter(Boolean);

    if (accepted.length === 0) {
      return {
        delivered: false,
        deliveredTo: [],
        error: `The mail server rejected every recipient${rejected.length ? ` (${rejected.join(", ")})` : ""}.`,
        provider: "smtp",
      };
    }
    return {
      delivered: true,
      deliveredTo: accepted,
      error: rejected.length ? `Rejected: ${rejected.join(", ")}` : "",
      provider: "smtp",
    };
  } catch (err) {
    return {
      delivered: false,
      deliveredTo: [],
      error: `SMTP send via ${host}:${port} failed: ${smtpErrText(err)}`,
      provider: "smtp",
    };
  }
}

/** Turn nodemailer/Node socket errors into something a clinic admin can act on. */
function smtpErrText(err: unknown): string {
  const code = (err as { code?: string })?.code;
  const response = (err as { response?: string })?.response ?? "";
  const base = errText(err);
  const detail = `${base} ${response}`.toLowerCase();

  if (code === "EAUTH") {
    // Microsoft 365 is retiring Basic auth for SMTP AUTH, and says so in the
    // response. Name that specifically — it is not a wrong-password problem
    // and retyping the password will never fix it.
    if (detail.includes("smtpclientauthentication") || detail.includes("disabled for the tenant")) {
      return `${base} — Microsoft 365 has SMTP AUTH switched off for this mailbox or tenant. An admin must enable "Authenticated SMTP" for the mailbox (Microsoft 365 admin centre → Users → Mail → Manage email apps), and the tenant-wide setting must allow it.`;
    }
    if (detail.includes("basic authentication") || detail.includes("basic auth")) {
      return `${base} — Microsoft 365 has disabled Basic authentication for SMTP. Either re-enable it for this mailbox, or send through a different mailbox (the sending account does not have to be the one that receives).`;
    }
    return `${base} — check SMTP_USER and SMTP_PASS. Gmail needs a 16-character App Password with 2-Step Verification enabled, not the normal account password. Microsoft 365 needs Authenticated SMTP enabled for the mailbox.`;
  }
  if (code === "ETIMEDOUT" || code === "ESOCKET" || code === "ECONNECTION") {
    return `${base} — could not reach the mail server. Confirm the host and port (Gmail 465, Microsoft 365 smtp.office365.com:587), and that outbound SMTP is permitted from the host.`;
  }
  if (code === "EENVELOPE") {
    return `${base} — the server refused the sender or recipient. If SMTP_FROM is set, it must be the authenticated mailbox or one of its verified aliases.`;
  }
  return response ? `${base} (${response})` : base;
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

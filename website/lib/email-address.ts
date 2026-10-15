// Pure address helpers — no imports, no env, no network. Kept separate from
// lib/email.ts so the admin UI can use them client-side without bundling the
// server-only sending code.

// Deliberately permissive — this guards against typos and empty strings, not
// against every RFC-5322 edge case. The mail provider is the real validator.
const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test((value ?? "").trim());
}

/**
 * A recipient field may hold several addresses ("reception@x.ca, manager@x.ca").
 * Split, trim, drop anything malformed, de-duplicate case-insensitively.
 */
export function parseRecipients(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of (raw ?? "").split(/[,;\n]/)) {
    const addr = part.trim();
    if (!isValidEmail(addr)) continue;
    const key = addr.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(addr);
  }
  return out;
}

/** Addresses in `raw` that are non-empty but not valid — used to warn in the admin. */
export function invalidRecipients(raw: string): string[] {
  return (raw ?? "")
    .split(/[,;\n]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !isValidEmail(p));
}

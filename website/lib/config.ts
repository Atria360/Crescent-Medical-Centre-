// Supabase connection. The anon key is a public, client-safe key by design;
// row-level security controls all access. Values can be overridden via env.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vhlhwqwsyfspmnfaxfbj.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGh3cXdzeWZzcG1uZmF4ZmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MDg4MjAsImV4cCI6MjA5OTQ4NDgyMH0.EaR6bVnqxZgxRX7Kc7o4i57wIGLg5oHZ4DI5pJtGGO0";

export const MEDIA_BUCKET = "media";

// Canonical site origin for sitemap / structured data. Override in production
// with NEXT_PUBLIC_SITE_URL (e.g. https://www.yourdomain.ca).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crescent-medical-centre.vercel.app"
).replace(/\/+$/, "");

export function mediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

// ---- color helpers for runtime per-location theming ----
// Tailwind colors are `rgb(var(--brand-*) / <alpha-value>)`, so the CSS vars
// hold a space-separated "r g b" triplet.

function hexToRgb(hex: string): [number, number, number] {
  const h = (hex || "").replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full || "000000", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function hexToRgbTriplet(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

// Mix a hex color toward white to get a lighter tint (for hover/light accents).
export function lightenTriplet(hex: string, amount = 0.4): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `${mix(r)} ${mix(g)} ${mix(b)}`;
}

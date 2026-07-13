// Supabase connection. The anon key is a public, client-safe key by design;
// row-level security controls all access. Values can be overridden via env.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vhlhwqwsyfspmnfaxfbj.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGh3cXdzeWZzcG1uZmF4ZmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MDg4MjAsImV4cCI6MjA5OTQ4NDgyMH0.EaR6bVnqxZgxRX7Kc7o4i57wIGLg5oHZ4DI5pJtGGO0";

export const MEDIA_BUCKET = "media";

export function mediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

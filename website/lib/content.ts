import { createPublicClient } from "@/lib/supabase/public";

export type BlockData = Record<string, unknown>;

// Per-location content blocks use a "{location}:{key}" key namespace. The
// primary location (westbrook) and truly-global blocks (e.g. `settings`) use
// the bare key, which also serves as the fallback for any location that hasn't
// customized a given block yet.
export async function getBlocks(
  keys: string[],
  location?: string
): Promise<Record<string, BlockData>> {
  const supabase = createPublicClient();
  const wanted = new Set(keys);
  const candidates = location ? [...keys, ...keys.map((k) => `${location}:${k}`)] : keys;

  const { data } = await supabase.from("content_blocks").select("key, data").in("key", candidates);

  const bare: Record<string, BlockData> = {};
  const scoped: Record<string, BlockData> = {};
  for (const row of data ?? []) {
    const key = row.key as string;
    const raw = (row.data as BlockData) ?? {};
    if (location && key.startsWith(`${location}:`)) {
      scoped[key.slice(location.length + 1)] = raw;
    } else if (wanted.has(key)) {
      bare[key] = raw;
    }
  }

  const out: Record<string, BlockData> = {};
  for (const k of keys) out[k] = scoped[k] ?? bare[k] ?? {};
  return out;
}

export async function getBlock(key: string, location?: string): Promise<BlockData> {
  return (await getBlocks([key], location))[key];
}

export async function getCollection<T = Record<string, unknown>>(
  table: string,
  opts: { filter?: [string, unknown]; orderBy?: string; location?: string } = {}
): Promise<T[]> {
  const supabase = createPublicClient();
  let q = supabase.from(table).select("*").order(opts.orderBy ?? "sort", { ascending: true });
  if (opts.location) q = q.eq("location", opts.location);
  if (opts.filter) q = q.eq(opts.filter[0], opts.filter[1] as never);
  const { data } = await q;
  return (data ?? []) as T[];
}

// convenience string accessor
export function s(block: BlockData, key: string, fallback = ""): string {
  const v = block[key];
  return typeof v === "string" ? v : fallback;
}

export function list(block: BlockData, key: string): Record<string, string>[] {
  const v = block[key];
  return Array.isArray(v) ? (v as Record<string, string>[]) : [];
}

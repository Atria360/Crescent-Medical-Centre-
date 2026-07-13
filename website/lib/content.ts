import { createClient } from "@/lib/supabase/server";

export type BlockData = Record<string, unknown>;

export async function getBlocks(keys: string[]): Promise<Record<string, BlockData>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_blocks")
    .select("key, data")
    .in("key", keys);
  const out: Record<string, BlockData> = {};
  for (const k of keys) out[k] = {};
  for (const row of data ?? []) out[row.key] = (row.data as BlockData) ?? {};
  return out;
}

export async function getBlock(key: string): Promise<BlockData> {
  return (await getBlocks([key]))[key];
}

export async function getCollection<T = Record<string, unknown>>(
  table: string,
  opts: { filter?: [string, unknown]; orderBy?: string } = {}
): Promise<T[]> {
  const supabase = await createClient();
  let q = supabase.from(table).select("*").order(opts.orderBy ?? "sort", { ascending: true });
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

import type { CSSProperties } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hexToRgbTriplet, lightenTriplet } from "@/lib/config";

export interface Location {
  slug: string;
  name: string;
  area: string;
  is_primary: boolean;
  sort: number;
  logo: string;
  logo_white: string;
  color_primary: string;
  color_primary_dark: string;
  color_accent: string;
  color_accent_dark: string;
  color_gold: string;
  phone: string;
  toll_free: string;
  email: string;
  address: string;
  map_embed_src: string;
  directions_url: string;
  hours: { line: string }[];
  hours_note: string;
  facebook: string;
  instagram: string;
  tagline: string;
  hero_image: string;
  google_reviews_url: string;
  form_email: string;
}

export async function getLocations(): Promise<Location[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("locations").select("*").order("sort", { ascending: true });
  return (data ?? []) as Location[];
}

export async function getLocation(slug: string): Promise<Location | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("locations").select("*").eq("slug", slug).maybeSingle();
  return (data as Location) ?? null;
}

export async function getPrimaryLocation(): Promise<Location | null> {
  const locs = await getLocations();
  return locs.find((l) => l.is_primary) ?? locs[0] ?? null;
}

// CSS custom properties that drive the Tailwind brand palette for a location.
// Applied via `style` on a wrapper so children resolve `teal`/`brand-red`/etc.
// against this location's colors.
export function themeVars(loc: Location): CSSProperties {
  return {
    "--brand-primary": hexToRgbTriplet(loc.color_primary),
    "--brand-primary-dark": hexToRgbTriplet(loc.color_primary_dark),
    "--brand-primary-light": lightenTriplet(loc.color_primary, 0.45),
    "--brand-accent": hexToRgbTriplet(loc.color_accent),
    "--brand-accent-dark": hexToRgbTriplet(loc.color_accent_dark),
    "--brand-gold": hexToRgbTriplet(loc.color_gold || "#F2C455"),
  } as CSSProperties;
}

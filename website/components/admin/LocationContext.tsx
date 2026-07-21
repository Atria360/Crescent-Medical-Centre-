"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AdminLoc {
  slug: string;
  area: string;
  is_primary: boolean;
  sort: number;
}

interface Ctx {
  locations: AdminLoc[];
  currentSlug: string;
  primarySlug: string;
  isPrimary: boolean;
  ready: boolean;
  setLocation: (slug: string) => void;
}

const LocationCtx = createContext<Ctx | null>(null);

function readCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|; )admin-loc=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<AdminLoc[]>([]);
  const [currentSlug, setCurrentSlug] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("locations")
      .select("slug, area, is_primary, sort")
      .order("sort")
      .then(({ data }) => {
        const locs = (data as AdminLoc[]) ?? [];
        setLocations(locs);
        const primary = locs.find((l) => l.is_primary)?.slug ?? locs[0]?.slug ?? "";
        const cookie = readCookie();
        setCurrentSlug(locs.some((l) => l.slug === cookie) ? cookie : primary);
        setReady(true);
      });
  }, []);

  const setLocation = useCallback((slug: string) => {
    document.cookie = `admin-loc=${encodeURIComponent(slug)}; path=/; max-age=31536000`;
    setCurrentSlug(slug);
  }, []);

  const primarySlug = locations.find((l) => l.is_primary)?.slug ?? locations[0]?.slug ?? "";
  const isPrimary = currentSlug === primarySlug;

  return (
    <LocationCtx.Provider
      value={{ locations, currentSlug, primarySlug, isPrimary, ready, setLocation }}
    >
      {children}
    </LocationCtx.Provider>
  );
}

export function useAdminLocation(): Ctx {
  const ctx = useContext(LocationCtx);
  if (!ctx) throw new Error("useAdminLocation must be used within LocationProvider");
  return ctx;
}

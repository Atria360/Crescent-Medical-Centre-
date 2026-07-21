"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Location } from "@/lib/locations";

// Slim strip above the header: tells the visitor which clinic they're viewing,
// remembers it (so the chooser can offer "Continue to …"), and offers a switch.
export default function LocationBanner({
  slug,
  area,
  others,
}: {
  slug: string;
  area: string;
  others: Location[];
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem("preferred-location", slug);
    } catch {
      /* ignore */
    }
  }, [slug]);

  if (hidden) return null;

  return (
    <div className="bg-brand-gradient text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[12px]">
        <p className="truncate">
          You&apos;re viewing the <span className="font-bold">{area}</span> clinic.
          {others.length > 0 && (
            <>
              {" "}
              {others.map((o) => (
                <Link key={o.slug} href={`/${o.slug}`} className="font-semibold underline underline-offset-2">
                  Switch to {o.area}
                </Link>
              ))}
            </>
          )}
        </p>
        <button
          onClick={() => setHidden(true)}
          aria-label="Dismiss"
          className="shrink-0 rounded p-0.5 hover:bg-white/20"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// If a returning visitor previously chose a clinic, offer a one-tap shortcut
// back to it (set by LocationBanner on each location page).
export default function ContinueBanner({ options }: { options: { slug: string; area: string }[] }) {
  const [pref, setPref] = useState<{ slug: string; area: string } | null>(null);

  useEffect(() => {
    try {
      const slug = window.localStorage.getItem("preferred-location");
      const match = options.find((o) => o.slug === slug);
      if (match) setPref(match);
    } catch {
      /* ignore */
    }
  }, [options]);

  if (!pref) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <Link
        href={`/${pref.slug}`}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-brand-dark shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5"
      >
        Continue to your {pref.area} clinic
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}

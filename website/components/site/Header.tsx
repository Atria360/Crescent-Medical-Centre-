"use client";

import Link from "next/link";
import { useState } from "react";
import { mediaUrl } from "@/lib/config";
import type { Location } from "@/lib/locations";

const NAV = [
  { label: "Medical Services", href: "/medical-services" },
  { label: "Uninsured Services", href: "/uninsured-services" },
  { label: "Our Team", href: "/our-team" },
  { label: "View Clinic", href: "/view-clinic" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

export default function Header({
  location,
  others,
  siteName,
}: {
  location: Location;
  others: Location[];
  siteName: string;
}) {
  const [open, setOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const base = `/${location.slug}`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={base} className="flex items-center gap-3">
          {location.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(location.logo)}
              alt={`${siteName} ${location.area}`}
              className="h-12 w-auto max-w-[230px] object-contain md:h-16"
            />
          ) : (
            <span className="text-xl font-bold">
              {siteName} <span className="text-teal">{location.area}</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              className="text-[15px] font-medium text-brand-dark transition-colors hover:text-teal"
            >
              {item.label}
            </Link>
          ))}
          {others.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSwitchOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-teal px-3.5 py-1.5 text-[13px] font-bold text-teal transition-colors hover:bg-teal hover:text-white"
              >
                <PinIcon className="h-3.5 w-3.5" />
                {location.area}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {switchOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  <p className="border-b border-gray-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-body">
                    Switch location
                  </p>
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      href={`/${o.slug}`}
                      onClick={() => setSwitchOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-brand-dark hover:bg-brand-light"
                    >
                      <PinIcon className="h-4 w-4 text-teal" />
                      {o.name} — {o.area}
                    </Link>
                  ))}
                  <Link
                    href="/"
                    onClick={() => setSwitchOpen(false)}
                    className="block border-t border-gray-100 px-4 py-2.5 text-xs font-semibold text-teal hover:bg-brand-light"
                  >
                    Compare both locations →
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 shadow-[2px_2px_2px_lightgrey] lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              onClick={() => setOpen(false)}
              className="block border-b border-gray-50 py-3 text-[15px] font-medium text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-b border-gray-50 py-3 text-[15px] font-bold text-teal"
            >
              <PinIcon className="h-4 w-4" />
              Go to {o.area} clinic
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

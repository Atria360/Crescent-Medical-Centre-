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
  // Only rendered when this clinic has an online booking link configured.
  const booking = location.booking_url?.trim() ?? "";
  const bookingLabel = location.booking_label?.trim() || "Book Appointment";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3">
        <Link href={base} className="flex shrink-0 items-center gap-3">
          {location.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(location.logo)} alt={`${siteName} ${location.area}`} className="h-11 w-auto nav:h-12" />
          ) : (
            <span className="text-xl font-bold">
              {siteName} <span className="text-teal">{location.area}</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-4 nav:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              className="whitespace-nowrap text-[14px] font-medium text-brand-dark transition-colors hover:text-teal"
            >
              {item.label}
            </Link>
          ))}
          {booking && (
            <a
              href={booking}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand-gradient px-4 py-2.5 text-[14px] font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CalendarIcon className="h-4 w-4" />
              {bookingLabel}
            </a>
          )}
          {others.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSwitchOpen((v) => !v)}
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-teal px-3.5 py-1.5 text-[13px] font-bold text-teal transition-colors hover:bg-teal hover:text-white"
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

        <div className="flex items-center gap-2 nav:hidden">
          {booking && (
            <a
              href={booking}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-2 text-[13px] font-bold text-white shadow-md"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Book
            </a>
          )}
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 shadow-[2px_2px_2px_lightgrey] nav:hidden">
          {booking && (
            <a
              href={booking}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="my-3 flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-[15px] font-bold text-white shadow-md"
            >
              <CalendarIcon className="h-4 w-4" />
              {bookingLabel}
            </a>
          )}
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1ZM4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9H4Zm5 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

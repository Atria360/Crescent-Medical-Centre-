"use client";

import Link from "next/link";
import { useState } from "react";
import { mediaUrl } from "@/lib/config";

const NAV = [
  { label: "Medical Services", href: "/medical-services" },
  { label: "Uninsured Services", href: "/uninsured-services" },
  { label: "Our Team", href: "/our-team" },
  { label: "View Clinic", href: "/view-clinic" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

export default function Header({ logo, siteName }: { logo: string; siteName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(logo)} alt={siteName} className="h-14 w-auto" />
          ) : (
            <span className="text-xl font-bold">{siteName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-brand-dark transition-colors hover:text-teal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
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
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-gray-50 py-3 text-[15px] font-medium text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

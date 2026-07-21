import Link from "next/link";
import type { BlockData } from "@/lib/content";
import { s, list } from "@/lib/content";
import { mediaUrl } from "@/lib/config";
import type { Location } from "@/lib/locations";

const DEFAULT_SERVICES = [
  { label: "Medical Services", href: "/medical-services" },
  { label: "Uninsured Services", href: "/uninsured-services" },
  { label: "Contact Us", href: "/contact-us" },
];

const DEFAULT_QUICKLINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Gallery", href: "/view-clinic" },
  { label: "FAQ", href: "/faq" },
];

// Prefix internal links with the location slug; leave external/anchor links alone.
function locHref(slug: string, href: string): string {
  if (!href || href === "/") return `/${slug}`;
  if (href.startsWith("/")) return `/${slug}${href}`;
  return href;
}

export default function Footer({ settings, location }: { settings: BlockData; location: Location }) {
  const slug = location.slug;
  const hours = location.hours ?? [];
  const services = list(settings, "footer_services");
  const quicklinks = list(settings, "footer_quicklinks");
  const servicesLinks = services.length ? services : DEFAULT_SERVICES;
  const quickLinks = quicklinks.length ? quicklinks : DEFAULT_QUICKLINKS;
  const directions = location.directions_url;

  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            {location.logo_white ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(location.logo_white)}
                alt={`${location.name} ${location.area}`}
                className="mb-4 h-14 w-auto max-w-[230px] object-contain md:h-16"
                loading="lazy"
              />
            ) : (
              <p className="mb-4 text-lg font-bold text-white">
                {location.name} <span className="text-teal">{location.area}</span>
              </p>
            )}
            <p className="text-sm leading-relaxed">{s(settings, "footer_tagline")}</p>
            <div className="mt-4 flex gap-3">
              {location.facebook && (
                <a
                  href={location.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-teal"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.5 1.6-1.5H17V2.2C16.4 2.1 15.3 2 14.1 2 11.1 2 9 3.7 9 7v3H6v4h3v8h4Z"/></svg>
                </a>
              )}
              {location.instagram && (
                <a
                  href={location.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-teal"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.2.1 4.7 1.7 4.8 4.8.1 1.3.1 1.6.1 4.9s0 3.6-.1 4.9c-.1 3.1-1.6 4.7-4.8 4.8-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.2-.1-4.7-1.7-4.8-4.8C2.2 15.6 2.2 15.3 2.2 12s0-3.6.1-4.9C2.4 4 4 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.5a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h6 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Services</h6>
            <ul className="space-y-2 text-sm">
              {servicesLinks.map((l, i) => (
                <li key={i}>
                  <Link href={locHref(slug, l.href || "/")} className="transition-colors hover:text-teal">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h6>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <Link href={locHref(slug, l.href || "/")} className="transition-colors hover:text-teal">{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/" className="transition-colors hover:text-teal">All locations</Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
              Locate Us — {location.area}
            </h6>
            <p className="text-sm">{location.address}</p>
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-teal transition-colors hover:text-teal-light"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4ZM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5Z"/></svg>
                Get Directions
              </a>
            )}
            {location.hours_note && <p className="mt-3 text-sm">{location.hours_note}</p>}
            {hours.length > 0 && (
              <>
                <p className="mt-3 text-sm font-semibold text-white">Clinic Hours</p>
                {hours.map((h, i) => (
                  <p key={i} className="text-sm">{h.line}</p>
                ))}
              </>
            )}
            {location.phone && (
              <p className="mt-3 text-sm">
                Phone: <a href={`tel:${location.phone}`} className="hover:text-teal">{location.phone}</a>
              </p>
            )}
            {location.toll_free && (
              <p className="text-sm">
                Toll Free: <a href={`tel:${location.toll_free}`} className="hover:text-teal">{location.toll_free}</a>
              </p>
            )}
            {location.fax && <p className="text-sm">Fax: {location.fax}</p>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        {s(settings, "copyright")}
      </div>
    </footer>
  );
}

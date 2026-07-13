import Link from "next/link";
import type { BlockData } from "@/lib/content";
import { s, list } from "@/lib/content";
import { mediaUrl } from "@/lib/config";

export default function Footer({ settings }: { settings: BlockData }) {
  const hours = list(settings, "hours");
  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            {s(settings, "logo_white") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(s(settings, "logo_white"))}
                alt={s(settings, "site_name")}
                className="mb-4 h-14 w-auto"
              />
            ) : null}
            <p className="text-sm leading-relaxed">{s(settings, "footer_tagline")}</p>
            <div className="mt-4 flex gap-3">
              {s(settings, "facebook") && (
                <a
                  href={s(settings, "facebook")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-teal"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.5 1.6-1.5H17V2.2C16.4 2.1 15.3 2 14.1 2 11.1 2 9 3.7 9 7v3H6v4h3v8h4Z"/></svg>
                </a>
              )}
              {s(settings, "instagram") && (
                <a
                  href={s(settings, "instagram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-teal"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.2.1 4.7 1.7 4.8 4.8.1 1.3.1 1.6.1 4.9s0 3.6-.1 4.9c-.1 3.1-1.6 4.7-4.8 4.8-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.2-.1-4.7-1.7-4.8-4.8C2.2 15.6 2.2 15.3 2.2 12s0-3.6.1-4.9C2.4 4 4 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.5a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h6 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Services</h6>
            <ul className="space-y-2 text-sm">
              <li><Link href="/medical-services" className="hover:text-teal">Medical Services</Link></li>
              <li><Link href="/uninsured-services" className="hover:text-teal">Uninsured Services</Link></li>
              <li><Link href="/contact-us" className="hover:text-teal">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h6>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-teal">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-teal">About Us</Link></li>
              <li><Link href="/view-clinic" className="hover:text-teal">Gallery</Link></li>
              <li><Link href="/faq" className="hover:text-teal">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Locate Us</h6>
            <p className="text-sm">{s(settings, "address")}</p>
            <p className="mt-3 text-sm">{s(settings, "hours_note")}</p>
            <p className="mt-3 text-sm font-semibold text-white">Clinic Hours</p>
            {hours.map((h, i) => (
              <p key={i} className="text-sm">{h.line}</p>
            ))}
            <p className="mt-3 text-sm">
              Phone: <a href={`tel:${s(settings, "phone")}`} className="hover:text-teal">{s(settings, "phone")}</a>
            </p>
            <p className="text-sm">
              Toll Free: <a href={`tel:${s(settings, "toll_free")}`} className="hover:text-teal">{s(settings, "toll_free")}</a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        {s(settings, "copyright")}
      </div>
    </footer>
  );
}

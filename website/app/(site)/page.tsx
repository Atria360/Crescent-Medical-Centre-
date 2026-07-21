import Link from "next/link";
import type { Metadata } from "next";
import { getBlock, getCollection, s } from "@/lib/content";
import { getLocations, getPrimaryLocation, themeVars } from "@/lib/locations";
import { mediaUrl } from "@/lib/config";
import ContinueBanner from "@/components/site/ContinueBanner";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Crescent Medical Centre — Two Calgary Locations",
  description:
    "Crescent Medical Centre — trusted family practice & walk-in care with two locations in Calgary. Choose your clinic to get started.",
};

interface Service {
  id: string;
  title: string;
}

export default async function ChooserPage() {
  const [locations, settings, primary] = await Promise.all([
    getLocations(),
    getBlock("settings"),
    getPrimaryLocation(),
  ]);

  const services = primary
    ? await getCollection<Service>("services", { location: primary.slug, filter: ["featured", true] })
    : [];

  const siteName = s(settings, "site_name", "Crescent Medical Centre");

  return (
    <main className="min-h-screen bg-white">
      <ContinueBanner options={locations.map((l) => ({ slug: l.slug, area: l.area }))} />

      {/* Split hero — each half self-brands in its clinic's palette */}
      <section className="flex min-h-screen flex-col md:flex-row">
        {locations.map((loc) => (
          <div
            key={loc.slug}
            style={themeVars(loc)}
            className="group relative flex min-h-[62vh] flex-1 flex-col items-center justify-center overflow-hidden bg-brand-gradient px-6 py-14 text-center text-white transition-[flex-grow] duration-500 ease-out md:min-h-screen md:hover:grow-[1.35]"
          >
            {loc.hero_image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(loc.hero_image)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-brand-gradient-soft" />
              </>
            ) : (
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            )}

            <div className="relative flex max-w-md flex-col items-center">
              {loc.logo_white ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(loc.logo_white)}
                  alt={`${loc.name} ${loc.area}`}
                  className="mb-6 h-16 w-auto max-w-[280px] object-contain md:h-24"
                />
              ) : (
                <p className="mb-2 text-lg font-semibold tracking-widest">{loc.name.toUpperCase()}</p>
              )}

              <h2 className="font-serif text-5xl italic md:text-6xl">{loc.area}</h2>
              {loc.tagline && <p className="mt-4 max-w-xs text-sm text-white/90">{loc.tagline}</p>}

              <div className="mt-6 space-y-1 text-sm text-white/90">
                {loc.address && (
                  <p className="flex items-center justify-center gap-2">
                    <PinIcon /> {loc.address}
                  </p>
                )}
                {(loc.hours ?? []).slice(0, 2).map((h, i) => (
                  <p key={i} className="text-white/80">{h.line}</p>
                ))}
              </div>

              <Link
                href={`/${loc.slug}`}
                className="btn-white mt-8 inline-flex items-center gap-2"
              >
                Enter {loc.area} clinic
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Shared band — one brand, two locations */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-teal">{siteName}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">One trusted name. Two Calgary locations.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-brand-body">
          Compassionate family practice and walk-in care, now closer to you. Choose the clinic that
          suits you best — each with its own team, hours, and welcoming space.
        </p>

        {services.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {services.slice(0, 8).map((svc) => (
              <span
                key={svc.id}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-brand-dark"
              >
                {svc.title}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Location detail cards */}
      <section className="bg-brand-light py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2">
          {locations.map((loc) => (
            <div key={loc.slug} style={themeVars(loc)} className="card overflow-hidden">
              <div className="bg-brand-gradient px-7 py-5 text-white">
                <h3 className="text-xl font-bold">
                  {loc.name} <span className="font-serif italic">— {loc.area}</span>
                </h3>
              </div>
              <div className="space-y-2 px-7 py-6 text-sm text-brand-body">
                {loc.address && (
                  <p className="flex items-start gap-2">
                    <PinIcon className="mt-0.5 text-teal" /> {loc.address}
                  </p>
                )}
                {loc.phone && <p>Phone: {loc.phone}</p>}
                {(loc.hours ?? []).map((h, i) => (
                  <p key={i}>{h.line}</p>
                ))}
                <div className="flex flex-wrap gap-3 pt-3">
                  <Link href={`/${loc.slug}`} className="btn-teal text-sm">
                    Visit {loc.area}
                  </Link>
                  {loc.directions_url && (
                    <a
                      href={loc.directions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-teal px-5 py-2.5 text-sm font-bold text-teal transition-colors hover:bg-teal hover:text-white"
                    >
                      Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-brand-dark py-6 text-center text-xs text-gray-400">
        {s(settings, "copyright", `${siteName} © All rights reserved`)}
      </footer>
    </main>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

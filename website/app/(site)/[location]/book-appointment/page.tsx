import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import { getBlock, s } from "@/lib/content";
import { getLocation } from "@/lib/locations";
import { SITE_URL } from "@/lib/config";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const loc = await getLocation(location);
  const area = loc?.area ?? "Calgary";
  return {
    title: `Book an Appointment — Crescent Medical Centre ${area}`,
    description:
      `Book an appointment at Crescent Medical Centre ${area}. Book online in a few taps, ` +
      `call the clinic, or walk in — appointments and walk-ins both welcome.`,
    alternates: { canonical: `${SITE_URL}/${location}/book-appointment` },
  };
}

export default async function BookAppointmentPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const [loc, block] = await Promise.all([
    getLocation(location),
    getBlock("contact_page", location),
  ]);

  const booking = loc?.booking_url?.trim() ?? "";
  const bookingLabel = loc?.booking_label?.trim() || "Book Appointment";
  const area = loc?.area ?? "";
  const hours = loc?.hours ?? [];

  return (
    <>
      <PageHero
        heading={`Book an Appointment${area ? ` — ${area}` : ""}`}
        subheading="Choose whichever suits you best — book online in a few taps, give us a call, or simply walk in."
        background={s(block, "hero_background")}
      />

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {/* 1. Online */}
          <div
            className={`card flex flex-col p-8 ${booking ? "ring-2 ring-teal md:col-span-2" : "md:col-span-3"}`}
            data-reveal
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal">
              Fastest
            </span>
            <h2 className="mt-4 text-2xl">Book online</h2>
            {booking ? (
              <>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-body">
                  See real available times and choose the one that suits you. You&apos;ll get a
                  confirmation straight away — no phone call, no waiting on hold.
                </p>
                <a
                  href={booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex w-fit items-center gap-2.5 rounded-full bg-brand-gradient px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <CalendarIcon />
                  {bookingLabel} Online
                  <ArrowIcon />
                </a>
                <p className="mt-3 text-xs text-brand-gray">Opens our secure booking page.</p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                Online booking isn&apos;t available at this clinic yet. Please call us or use the
                contact form and we&apos;ll arrange a time with you.
              </p>
            )}
          </div>

          {/* 2. Phone */}
          <div className="card flex flex-col p-8" data-reveal data-reveal-delay="1">
            <h2 className="text-xl">Call us</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-body">
              Prefer to speak to someone? Our reception team is happy to help find a time.
            </p>
            {loc?.phone && (
              <a href={`tel:${loc.phone}`} className="btn-teal mt-6 w-fit text-sm">
                {loc.phone}
              </a>
            )}
            {loc?.toll_free && (
              <p className="mt-3 text-sm text-brand-body">
                Toll free:{" "}
                <a href={`tel:${loc.toll_free}`} className="font-bold text-teal hover:underline">
                  {loc.toll_free}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* 3. Walk in */}
        <div className="card mt-6 p-8" data-reveal>
          <h2 className="text-xl">Walk in</h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-body">
            Walk-in patients are welcome. Booked appointments take priority, so there may be a
            wait — calling ahead or booking online is the quickest way in.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {loc?.address && (
              <p className="text-sm text-brand-body">
                <span className="block font-bold text-brand-dark">Where</span>
                {loc.address}
              </p>
            )}
            {hours.length > 0 && (
              <div className="text-sm text-brand-body">
                <span className="block font-bold text-brand-dark">Clinic hours</span>
                {hours.map((h, i) => (
                  <span key={i} className="block">
                    {h.line}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {loc?.directions_url && (
              <a
                href={loc.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-teal px-5 py-2.5 text-sm font-bold text-teal transition-colors hover:bg-teal hover:text-white"
              >
                Get directions
              </a>
            )}
            <Link href={`/${location}/contact-us`} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-brand-dark transition-colors hover:bg-brand-light">
              Send us a message
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-brand-body">
          For a medical emergency, call <a href="tel:911" className="font-bold text-brand-red">911</a>.
          For 24/7 health advice, call <a href="tel:811" className="font-bold text-teal">811</a>.
        </p>
      </section>
    </>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1ZM4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9H4Zm5 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

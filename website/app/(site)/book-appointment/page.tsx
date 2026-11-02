import Link from "next/link";
import type { Metadata } from "next";
import { getLocations, themeVars } from "@/lib/locations";
import { SITE_URL } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Book an Appointment — Crescent Medical Centre, Calgary",
  description:
    "Book an appointment at Crescent Medical Centre in Calgary. Book online in a few taps, " +
    "call the clinic, or walk in. Two locations — Westbrook and Downtown.",
  alternates: { canonical: `${SITE_URL}/book-appointment` },
};

export default async function BookAppointmentIndex() {
  const locations = await getLocations();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-brand-gradient px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl leading-tight md:text-4xl">Book an Appointment</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed md:text-base">
            Choose your clinic below. You can book online in a few taps, call us, or simply walk
            in — appointments and walk-ins are both welcome.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {locations.map((loc) => {
            const booking = loc.booking_url?.trim() ?? "";
            const label = loc.booking_label?.trim() || "Book Appointment";
            return (
              <div key={loc.slug} style={themeVars(loc)} className="card overflow-hidden">
                <div className="bg-brand-gradient px-7 py-5 text-white">
                  <h2 className="text-xl font-bold">
                    {loc.name} <span className="font-serif italic">— {loc.area}</span>
                  </h2>
                </div>
                <div className="space-y-2 px-7 py-6 text-sm text-brand-body">
                  {loc.address && <p>{loc.address}</p>}
                  {(loc.hours ?? []).map((h, i) => (
                    <p key={i}>{h.line}</p>
                  ))}

                  <div className="flex flex-col gap-3 pt-5">
                    {booking ? (
                      <a
                        href={booking}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
                      >
                        {label} Online
                      </a>
                    ) : (
                      <p className="text-sm text-brand-body">
                        Online booking isn&apos;t available here yet — please call or message us.
                      </p>
                    )}

                    {loc.phone && (
                      <p>
                        Call:{" "}
                        <a href={`tel:${loc.phone}`} className="font-bold text-teal hover:underline">
                          {loc.phone}
                        </a>
                      </p>
                    )}

                    <Link
                      href={`/${loc.slug}/book-appointment`}
                      className="text-sm font-bold text-teal hover:underline"
                    >
                      All ways to book at {loc.area} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-brand-body">
          For a medical emergency, call{" "}
          <a href="tel:911" className="font-bold text-brand-red">911</a>. For 24/7 health advice,
          call <a href="tel:811" className="font-bold text-teal">811</a>.
        </p>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-bold text-teal hover:underline">
            ← Back to Crescent Medical Centre
          </Link>
        </p>
      </section>
    </main>
  );
}

import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";
import { getBlock, s, list } from "@/lib/content";
import { getLocation } from "@/lib/locations";

export const revalidate = 60;

export const metadata = { title: "Contact Us – Crescent Medical Centre" };

export default async function ContactPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const [block, loc] = await Promise.all([getBlock("contact_page", location), getLocation(location)]);
  const mapSrc = loc?.map_embed_src ?? "";
  const directions = loc?.directions_url ?? "";
  const reviewsUrl =
    loc?.google_reviews_url ||
    "https://www.google.com/maps/search/?api=1&query=Crescent+Medical+Centre+Calgary";

  return (
    <>
      <PageHero
        heading={s(block, "hero_heading")}
        subheading={s(block, "hero_subheading")}
        background={s(block, "hero_background")}
      />

      {/* Info cards */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {list(block, "cards").map((card, i) => (
            <div key={i} className="card border border-gray-100 p-7 text-center hover:shadow-xl" data-reveal data-reveal-delay={String(i + 1)}>
              <h3 className="text-lg text-teal">{card.title}</h3>
              <p className="mt-3 text-sm text-brand-body">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Forms */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
          <div className="card p-9" data-reveal>
            <h2 className="text-2xl">{s(block, "form_heading")}</h2>
            <p className="mt-3 text-sm text-brand-body">{s(block, "form_body")}</p>
            <div className="mt-7">
              <ContactForm withSubject location={location} />
            </div>
          </div>
          <div
            className="card relative flex flex-col overflow-hidden p-9"
            data-reveal
            data-reveal-delay="1"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal/10" />
            <div className="relative flex flex-1 flex-col">
              <div className="flex items-center gap-1 text-amber-400" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} />
                ))}
              </div>
              <h2 className="mt-4 text-2xl">
                {s(block, "reviews_heading", "Loved Your Experience?")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                {s(
                  block,
                  "reviews_body",
                  "Your feedback means the world to us — and it helps other families in Calgary find trusted care. Please take a moment to share your visit with a quick review on Google."
                )}
              </p>
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal mt-auto inline-flex items-center justify-center gap-2 self-start"
              >
                <GoogleG />
                Review us on Google
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {mapSrc ? (
        <div className="relative">
          <iframe
            src={mapSrc}
            className="h-[420px] w-full border-0"
            loading="lazy"
            title="Clinic location map"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {directions ? (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              Get Directions →
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function Star() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z" />
    </svg>
  );
}

function GoogleG() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3c-1.65 4.66-6.08 8-11.3 8a12 12 0 1 1 7.96-20.96l5.66-5.66A20 20 0 1 0 24 44c11.05 0 20-8.95 20-20 0-1.34-.14-2.65-.39-3.92Z" />
      <path fill="#FF3D00" d="m6.31 14.69 6.57 4.82A11.99 11.99 0 0 1 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66A19.9 19.9 0 0 0 24 4 20 20 0 0 0 6.31 14.69Z" />
      <path fill="#4CAF50" d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.19-5.24A11.9 11.9 0 0 1 24 36c-5.2 0-9.62-3.32-11.28-7.95l-6.52 5.02A20 20 0 0 0 24 44Z" />
      <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3a12.05 12.05 0 0 1-4.09 5.56l6.19 5.24C39.19 34.99 44 30.09 44 24c0-1.34-.14-2.65-.39-3.92Z" />
    </svg>
  );
}

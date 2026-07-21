import PageHero from "@/components/site/PageHero";
import { getBlock, getCollection, s, list } from "@/lib/content";
import { mediaUrl } from "@/lib/config";

export const revalidate = 60;

interface Testimonial {
  id: string;
  name: string;
  quote: string;
}

export const metadata = { title: "About Us – Crescent Medical Centre" };

export default async function AboutPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const [block, testimonials] = await Promise.all([
    getBlock("about_page", location),
    getCollection<Testimonial>("testimonials", { location }),
  ]);

  return (
    <>
      <PageHero
        heading={s(block, "hero_heading")}
        subheading={`${s(block, "hero_subheading")} ${s(block, "hero_badge")}`.trim()}
        background={s(block, "hero_background")}
      />

      {/* Get to know us */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <div>
          <h2 className="section-heading" data-reveal>{s(block, "know_heading")}</h2>
          <p className="mt-6 text-sm leading-relaxed text-brand-body">{s(block, "know_body")}</p>
          <ul className="mt-6 space-y-3">
            {list(block, "know_points").map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-white">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        {s(block, "mission_image") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(s(block, "mission_image"))}
            alt="Our mission"
            loading="lazy"
            data-reveal
            className="w-full rounded-card object-cover shadow-lg"
          />
        ) : null}
      </section>

      {/* Mission */}
      <section className="bg-teal py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-heading heading-accent text-center" data-reveal>{s(block, "mission_heading")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {list(block, "mission_items").map((item, i) => (
              <div key={i} className="card p-8 text-brand-dark hover:shadow-xl" data-reveal data-reveal-delay={String(i + 1)}>
                <h3 className="text-lg text-teal">{item.title}</h3>
                <p className="mt-3 text-sm text-brand-body">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision + goals */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {s(block, "goals_image") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(s(block, "goals_image"))}
            alt="Our vision"
            loading="lazy"
            data-reveal
            className="w-full rounded-card object-cover shadow-lg"
          />
        ) : null}
        <div>
          <h2 className="section-heading">{s(block, "vision_heading")}</h2>
          <p className="mt-5 text-sm leading-relaxed text-brand-body">{s(block, "vision_body")}</p>
          <h2 className="section-heading mt-10">{s(block, "goals_heading")}</h2>
          <ul className="mt-5 space-y-4">
            {list(block, "goals_items").map((g, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-brand-body">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>
                </span>
                {g.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-brand-light py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="section-heading heading-accent text-center" data-reveal>{s(block, "testimonials_heading", "Our Patients' Experiences")}</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.id} className="card p-8 hover:shadow-xl" data-reveal>
                  <svg className="h-8 w-8 text-teal" fill="currentColor" viewBox="0 0 24 24"><path d="M9.6 5C6 7 3.9 10 3.9 14.1c0 3 1.8 4.9 4.1 4.9 2.1 0 3.6-1.5 3.6-3.5S10.2 12 8.2 12c-.4 0-.9.1-1 .1.3-2 2-4.3 4-5.5L9.6 5Zm10 0c-3.5 2-5.7 5-5.7 9.1 0 3 1.8 4.9 4.1 4.9 2.1 0 3.6-1.5 3.6-3.5S20.2 12 18.2 12c-.4 0-.8.1-1 .1.3-2 2-4.3 4-5.5L19.6 5Z"/></svg>
                  <blockquote className="mt-4 text-sm leading-relaxed text-brand-body">{t.quote}</blockquote>
                  <figcaption className="mt-4 text-sm font-bold">{t.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

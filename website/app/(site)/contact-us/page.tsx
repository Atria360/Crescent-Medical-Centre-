import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";
import { getBlocks, s, list } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contact Us – Crescent Medical Centre" };

export default async function ContactPage() {
  const blocks = await getBlocks(["contact_page", "settings"]);
  const block = blocks.contact_page;
  const settings = blocks.settings;

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
            <div key={i} className="card border border-gray-100 p-7 text-center">
              <h3 className="text-lg text-teal">{card.title}</h3>
              <p className="mt-3 text-sm text-brand-body">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Forms */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
          <div className="card p-9">
            <h2 className="text-2xl">{s(block, "form_heading")}</h2>
            <p className="mt-3 text-sm text-brand-body">{s(block, "form_body")}</p>
            <div className="mt-7">
              <ContactForm withSubject />
            </div>
          </div>
          <div className="card p-9">
            <h2 className="text-2xl">{s(block, "feedback_heading")}</h2>
            <p className="mt-3 text-sm text-brand-body">{s(block, "feedback_body")}</p>
            <div className="mt-7">
              <ContactForm withSubject={false} defaultSubject="Feedback" />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {s(settings, "map_embed_src") ? (
        <iframe
          src={s(settings, "map_embed_src")}
          className="h-[420px] w-full border-0"
          loading="lazy"
          title="Clinic location map"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : null}
    </>
  );
}

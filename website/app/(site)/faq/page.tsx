import PageHero from "@/components/site/PageHero";
import FaqAccordion, { type FaqItem } from "@/components/site/FaqAccordion";
import { getBlock, getCollection, s } from "@/lib/content";

export const revalidate = 60;

export const metadata = { title: "FAQ – Crescent Medical Centre" };

export default async function FaqPage() {
  const [block, faqs] = await Promise.all([
    getBlock("faq_page"),
    getCollection<FaqItem>("faqs"),
  ]);

  return (
    <>
      <PageHero
        heading={s(block, "hero_heading")}
        subheading={s(block, "hero_subheading")}
        background={s(block, "hero_background")}
      />

      <section className="mx-auto max-w-4xl px-4 py-20">
        <h2 className="section-heading heading-accent text-center" data-reveal>{s(block, "list_heading")}</h2>
        <p className="mt-4 text-center text-sm text-brand-body">{s(block, "list_subheading")}</p>
        <div className="mt-12" data-reveal>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}

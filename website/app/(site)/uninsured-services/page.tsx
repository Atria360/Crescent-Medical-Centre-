import PageHero from "@/components/site/PageHero";
import { getBlock, getCollection, s } from "@/lib/content";

export const revalidate = 60;

export const metadata = { title: "Uninsured Services – Crescent Medical Centre" };

interface FeeSection {
  id: string;
  title: string;
}

interface FeeItem {
  id: string;
  section_id: string;
  service: string;
  cost: string;
}

export default async function UninsuredPage() {
  const [block, sections, items] = await Promise.all([
    getBlock("uninsured_page"),
    getCollection<FeeSection>("fee_sections"),
    getCollection<FeeItem>("fee_items"),
  ]);

  return (
    <>
      <PageHero
        heading={s(block, "hero_heading")}
        subheading={s(block, "hero_subheading")}
        background={s(block, "hero_background")}
      />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="section-heading" data-reveal>{s(block, "intro_heading")}</h2>
        <p className="mt-5 text-sm leading-relaxed text-brand-body">{s(block, "intro_body")}</p>

        {sections.map((section) => {
          const rows = items.filter((i) => i.section_id === section.id);
          if (rows.length === 0) return null;
          return (
            <div key={section.id} className="mt-12" data-reveal>
              <h3 className="text-xl">{section.title}</h3>
              <div className="mt-4 overflow-x-auto rounded-card border border-gray-100 shadow-sm">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-teal text-left text-white">
                      <th className="px-5 py-3 font-bold">Services</th>
                      <th className="w-40 px-5 py-3 font-bold">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id} className={i % 2 ? "bg-brand-light" : "bg-white"}>
                        <td className="px-5 py-3 text-brand-dark">{row.service}</td>
                        <td className="px-5 py-3 font-bold text-brand-red">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {s(block, "note") ? (
          <p className="mt-10 text-sm italic text-brand-body">{s(block, "note")}</p>
        ) : null}
      </section>
    </>
  );
}

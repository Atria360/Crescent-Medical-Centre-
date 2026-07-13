import PageHero from "@/components/site/PageHero";
import { getBlock, getCollection, s } from "@/lib/content";
import { mediaUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = { title: "Medical Services – Crescent Medical Centre" };

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export default async function ServicesPage() {
  const [block, services] = await Promise.all([
    getBlock("services_page"),
    getCollection<Service>("services"),
  ]);

  return (
    <>
      <PageHero
        heading={s(block, "hero_heading")}
        subheading={s(block, "hero_subheading")}
        background={s(block, "hero_background")}
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="section-heading text-center">{s(block, "list_heading")}</h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="card overflow-hidden transition-transform hover:-translate-y-1">
              {service.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(service.image_url)}
                  alt={service.title}
                  className="aspect-[3/2] w-full object-cover"
                />
              ) : (
                <div className="aspect-[3/2] w-full bg-teal/10" />
              )}
              <div className="p-6">
                <h3 className="text-lg">{service.title}</h3>
                <p className="mt-2 text-sm text-brand-body">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

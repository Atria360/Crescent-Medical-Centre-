import PageHero from "@/components/site/PageHero";
import { getBlock, getCollection, s } from "@/lib/content";
import { mediaUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = { title: "Our Team – Crescent Medical Centre" };

interface TeamMember {
  id: string;
  name: string;
  credentials: string;
  role: string;
  bio: string;
  photo_url: string;
}

export default async function TeamPage() {
  const [block, members] = await Promise.all([
    getBlock("team_page"),
    getCollection<TeamMember>("team_members"),
  ]);

  const physicians = members.filter((m) => m.role === "physician");
  const staff = members.filter((m) => m.role === "staff");
  const assistants = members.filter((m) => m.role === "assistant");

  return (
    <>
      <PageHero
        heading={s(block, "hero_heading")}
        subheading={s(block, "hero_subheading")}
        background={s(block, "hero_background")}
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="section-heading text-center">{s(block, "physicians_heading")}</h2>
        <div className="mt-14 space-y-16">
          {[...physicians, ...staff].map((m, i) => (
            <article
              key={m.id}
              className={`flex flex-col items-center gap-10 lg:flex-row ${i % 2 ? "lg:flex-row-reverse" : ""}`}
            >
              {m.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(m.photo_url)}
                  alt={m.name}
                  className="h-64 w-64 shrink-0 rounded-card object-cover shadow-lg"
                />
              ) : (
                <div className="h-64 w-64 shrink-0 rounded-card bg-teal/10" />
              )}
              <div>
                <h3 className="text-2xl">{m.name}</h3>
                {m.credentials ? (
                  <p className="mt-1 text-sm font-bold text-teal">{m.credentials}</p>
                ) : null}
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-body">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {assistants.length > 0 && (
        <section className="bg-teal py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="section-heading">{s(block, "assistants_heading")}</h2>
            <p className="mt-3 text-sm">{s(block, "assistants_subheading")}</p>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
              {assistants.map((m) => (
                <div key={m.id} className="card overflow-hidden pb-5 text-brand-dark">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(m.photo_url)}
                      alt={m.name}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-teal/10" />
                  )}
                  <h3 className="mt-4 px-2 text-sm">{m.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

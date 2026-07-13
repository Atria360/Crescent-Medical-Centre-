import Link from "next/link";
import { getBlocks, getCollection, s, list } from "@/lib/content";
import { mediaUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  featured: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  credentials: string;
  photo_url: string;
  featured: boolean;
}

export default async function HomePage() {
  const blocks = await getBlocks([
    "settings",
    "home_hero",
    "home_quick_cards",
    "home_services",
    "home_why",
    "home_team",
    "home_chatbot",
    "home_business",
    "home_resources",
  ]);
  const [services, team] = await Promise.all([
    getCollection<Service>("services", { filter: ["featured", true] }),
    getCollection<TeamMember>("team_members", { filter: ["featured", true] }),
  ]);

  const hero = blocks.home_hero;
  const quick = blocks.home_quick_cards;
  const svc = blocks.home_services;
  const why = blocks.home_why;
  const teamBlock = blocks.home_team;
  const chatbot = blocks.home_chatbot;
  const business = blocks.home_business;
  const resources = blocks.home_resources;
  const settings = blocks.settings;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {s(hero, "background") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(s(hero, "background"))}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-brand-gradient-soft" />
        <div className="relative mx-auto max-w-7xl px-4 pb-40 pt-24 text-white md:pt-32">
          <h1 className="max-w-2xl text-3xl leading-tight md:text-4xl">
            {s(hero, "heading")}
          </h1>
          <p className="mt-5 max-w-xl text-sm md:text-base">{s(hero, "subheading")}</p>
          <Link href={s(hero, "cta_href", "/contact-us")} className="btn-white mt-8">
            {s(hero, "cta_label", "Contact Us")}
          </Link>
        </div>
      </section>

      {/* Quick action cards */}
      <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {list(quick, "cards").map((card, i) => (
            <Link
              key={i}
              href={card.href || "/contact-us"}
              className="card flex flex-col items-center px-8 py-10 text-center transition-transform hover:-translate-y-1"
            >
              {card.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(card.icon)} alt="" className="mb-5 h-14 w-14" />
              ) : null}
              <h3 className="text-lg">{card.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Services band */}
      <section className="mt-[-40px] bg-teal pb-20 pt-36 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="section-heading max-w-md">{s(svc, "heading")}</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed">{s(svc, "body")}</p>
            <Link href={s(svc, "cta_href", "/medical-services")} className="btn-white mt-8">
              {s(svc, "cta_label", "Medical Services")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {services.slice(0, 9).map((service) => (
              <Link
                key={service.id}
                href="/medical-services"
                className="card flex flex-col items-center gap-3 px-4 py-7 text-center text-teal transition-transform hover:-translate-y-1"
              >
                <ServiceIcon />
                <span className="text-sm font-bold text-brand-dark">{service.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="section-heading text-center">{s(why, "heading")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-brand-body">
          {s(why, "subheading")}
        </p>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {list(why, "items").map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>
                </span>
                <div>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-1 text-sm text-brand-body">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          {s(why, "image") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(s(why, "image"))}
              alt="Our team"
              className="w-full rounded-card object-cover shadow-lg"
            />
          ) : null}
        </div>
      </section>

      {/* Team teaser */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="section-heading">{s(teamBlock, "heading")}</h2>
          <p className="mt-3 text-sm text-brand-body">{s(teamBlock, "subheading")}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((member) => (
              <Link key={member.id} href="/our-team" className="card overflow-hidden pb-6 transition-transform hover:-translate-y-1">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(member.photo_url)}
                    alt={member.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full bg-teal/10" />
                )}
                <h3 className="mt-5 px-3 text-base">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-teal">{member.credentials}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot + business enquiries */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2">
        <div className="card bg-brand-gradient p-10 text-white">
          <h2 className="text-2xl">{s(chatbot, "heading")}</h2>
          <p className="mt-4 text-sm leading-relaxed">{s(chatbot, "body")}</p>
          <p className="mt-3 text-sm leading-relaxed">{s(chatbot, "body2")}</p>
        </div>
        <div className="card border border-gray-100 p-10">
          <h2 className="text-2xl">{s(business, "heading")}</h2>
          <p className="mt-4 text-sm text-brand-body">{s(business, "body")}</p>
          <a href={`mailto:${s(business, "email")}`} className="btn-teal mt-6">
            {s(business, "email")}
          </a>
        </div>
      </section>

      {/* Additional resources */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-heading text-center">{s(resources, "heading")}</h2>
          <p className="mt-3 text-center text-sm text-brand-body">{s(resources, "subheading")}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list(resources, "items").map((item, i) => (
              <div key={i} className="card p-7">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-body">{item.text}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-bold text-teal hover:underline"
                  >
                    Learn more →
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      {s(settings, "map_embed_src") ? (
        <section>
          <h2 className="section-heading py-10 text-center">Our Location</h2>
          <iframe
            src={s(settings, "map_embed_src")}
            className="h-[420px] w-full border-0"
            loading="lazy"
            title="Clinic location map"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      ) : null}
    </>
  );
}

function ServiceIcon() {
  return (
    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M19 8h-2V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v2H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3ZM9 6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V6Zm6 9h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2Z" />
    </svg>
  );
}

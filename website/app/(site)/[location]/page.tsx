import Link from "next/link";
import { getBlocks, getCollection, s, list } from "@/lib/content";
import { mediaUrl } from "@/lib/config";
import { getLocation } from "@/lib/locations";
import ChatOpenButton from "@/components/site/ChatOpenButton";

export const revalidate = 60;

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

export default async function HomePage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const base = `/${location}`;
  const L = (href: string) => (href && href.startsWith("/") ? `${base}${href === "/" ? "" : href}` : href || base);

  const [blocks, loc, services, team] = await Promise.all([
    getBlocks(
      [
        "home_hero",
        "home_quick_cards",
        "home_services",
        "home_why",
        "home_team",
        "home_chatbot",
        "home_business",
        "home_resources",
      ],
      location
    ),
    getLocation(location),
    getCollection<Service>("services", { filter: ["featured", true], location }),
    getCollection<TeamMember>("team_members", { filter: ["featured", true], location }),
  ]);

  const hero = blocks.home_hero;
  const quick = blocks.home_quick_cards;
  const svc = blocks.home_services;
  const why = blocks.home_why;
  const teamBlock = blocks.home_team;
  const chatbot = blocks.home_chatbot;
  const business = blocks.home_business;
  const resources = blocks.home_resources;
  const phone = loc?.phone ?? "";
  const directions = loc?.directions_url ?? "";
  const mapSrc = loc?.map_embed_src ?? "";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {s(hero, "background") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(s(hero, "background"))}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-brand-gradient-soft" />
        <div className="hero-in relative mx-auto max-w-7xl px-4 pb-40 pt-20 text-white md:pt-32">
          <h1 className="max-w-2xl text-3xl leading-tight md:text-4xl">{s(hero, "heading")}</h1>
          <p className="mt-5 max-w-xl text-sm md:text-base">{s(hero, "subheading")}</p>
          <div className="mt-8">
            <Link href={L(s(hero, "cta_href", "/contact-us"))} className="btn-white">
              {s(hero, "cta_label", "Contact Us")}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick action cards */}
      <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {list(quick, "cards").map((card, i) => (
            <Link
              key={i}
              href={L(card.href || "/contact-us")}
              data-reveal
              data-reveal-delay={String(i + 1)}
              className="card flex flex-col items-center px-8 py-10 text-center transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              {card.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(card.icon)} alt="" className="mb-5 h-14 w-14" loading="lazy" />
              ) : null}
              <h3 className="text-lg">{card.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Services band */}
      <section className="mt-[-40px] bg-teal pb-20 pt-36 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div data-reveal>
            <h2 className="section-heading max-w-md">{s(svc, "heading")}</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed">{s(svc, "body")}</p>
            <div className="mt-8">
              <Link href={L(s(svc, "cta_href", "/medical-services"))} className="btn-white">
                {s(svc, "cta_label", "Medical Services")}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {services.slice(0, 9).map((service, i) => (
              <Link
                key={service.id}
                href={`${base}/medical-services`}
                data-reveal
                data-reveal-delay={String((i % 3) + 1)}
                className="card flex flex-col items-center gap-3 px-4 py-7 text-center text-teal transition-transform hover:-translate-y-1 hover:shadow-xl"
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
        <h2 className="section-heading heading-accent text-center" data-reveal>{s(why, "heading")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-brand-body" data-reveal>
          {s(why, "subheading")}
        </p>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {list(why, "items").map((item, i) => (
              <div key={i} className="flex gap-4" data-reveal data-reveal-delay={String(i + 1)}>
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
              loading="lazy"
              data-reveal
              className="w-full rounded-card object-cover shadow-lg"
            />
          ) : null}
        </div>
      </section>

      {/* Team teaser */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="section-heading heading-accent" data-reveal>{s(teamBlock, "heading")}</h2>
          <p className="mt-3 text-sm text-brand-body" data-reveal>{s(teamBlock, "subheading")}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((member, i) => (
              <Link
                key={member.id}
                href={`${base}/our-team`}
                data-reveal
                data-reveal-delay={String(i + 1)}
                className="card overflow-hidden pb-6 transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(member.photo_url)}
                    alt={member.name}
                    loading="lazy"
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

      {/* Help CTA + business enquiries */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2">
        <div className="card relative min-w-0 overflow-hidden bg-brand-gradient p-7 text-white md:p-10" data-reveal>
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="text-2xl">{s(chatbot, "help_heading", "Have Questions? We're Here to Help")}</h2>
            <p className="mt-4 text-sm leading-relaxed">
              {s(
                chatbot,
                "help_body",
                "Whether you'd like to book an appointment, ask about a service, or just need general information, chat with our virtual assistant or reach our friendly team — walk-ins are always welcome too."
              )}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? (
                <a href={`tel:${phone}`} className="btn-white inline-flex items-center gap-2">
                  <PhoneIcon />
                  Call {phone}
                </a>
              ) : null}
              <ChatOpenButton label="Chat with us" />
              <Link
                href={`${base}/contact-us`}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
        <div className="card min-w-0 border border-gray-100 p-7 md:p-10" data-reveal data-reveal-delay="1">
          <h2 className="text-2xl">{s(business, "heading")}</h2>
          <p className="mt-4 text-sm text-brand-body">{s(business, "body")}</p>
          <a
            href={`mailto:${s(business, "email", loc?.email ?? "")}`}
            className="btn-teal mt-6 inline-flex items-center gap-2 self-start"
          >
            {s(business, "cta_label", "Reach Out")}
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* Additional resources */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-heading heading-accent text-center" data-reveal>{s(resources, "heading")}</h2>
          <p className="mt-3 text-center text-sm text-brand-body" data-reveal>{s(resources, "subheading")}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list(resources, "items").map((item, i) => (
              <div key={i} className="card p-7 hover:shadow-xl" data-reveal data-reveal-delay={String((i % 3) + 1)}>
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
      {mapSrc ? (
        <section>
          <h2 className="section-heading heading-accent py-10 text-center" data-reveal>
            Our Location — {loc?.area}
          </h2>
          <div className="relative">
            <iframe
              src={mapSrc}
              className="h-[420px] w-full border-0"
              loading="lazy"
              title="Clinic location map"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-red absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                Get Directions →
              </a>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M19 8h-2V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v2H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3ZM9 6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V6Zm6 9h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2Z" />
    </svg>
  );
}

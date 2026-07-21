import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopBar from "@/components/site/TopBar";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Effects from "@/components/site/Effects";
import FloatingCall from "@/components/site/FloatingCall";
import ChatWidget from "@/components/site/ChatWidget";
import LocationBanner from "@/components/site/LocationBanner";
import { getBlock, s } from "@/lib/content";
import { getLocation, getLocations, themeVars } from "@/lib/locations";
import { mediaUrl, SITE_URL } from "@/lib/config";

export const revalidate = 60;

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const loc = await getLocation(location);
  if (!loc) return {};
  const title = `${loc.name} — ${loc.area}`;
  const description =
    loc.tagline || `${loc.name} in ${loc.area}, Calgary — family practice & walk-in clinic.`;
  const image = loc.logo ? mediaUrl(loc.logo) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function LocationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const [loc, settings, locations] = await Promise.all([
    getLocation(location),
    getBlock("settings"),
    getLocations(),
  ]);
  if (!loc) notFound();

  const others = locations.filter((l) => l.slug !== loc.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `${loc.name} — ${loc.area}`,
    url: `${SITE_URL}/${loc.slug}`,
    ...(loc.phone ? { telephone: loc.phone } : {}),
    ...(loc.email ? { email: loc.email } : {}),
    ...(loc.logo ? { image: mediaUrl(loc.logo) } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    areaServed: `Calgary${loc.area ? ` — ${loc.area}` : ""}`,
  };

  return (
    <div style={themeVars(loc)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationBanner slug={loc.slug} area={loc.area} others={others} />
      <TopBar settings={settings} location={loc} />
      <Header location={loc} others={others} siteName={s(settings, "site_name", loc.name)} />
      <main>{children}</main>
      <Footer settings={settings} location={loc} />
      <FloatingCall phone={loc.phone} />
      <ChatWidget siteName={`${loc.name} — ${loc.area}`} location={loc.slug} />
      <Effects />
    </div>
  );
}

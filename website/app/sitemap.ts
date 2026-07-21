import type { MetadataRoute } from "next";
import { getLocations } from "@/lib/locations";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

const PAGES = [
  "",
  "/about-us",
  "/our-team",
  "/medical-services",
  "/uninsured-services",
  "/faq",
  "/contact-us",
  "/view-clinic",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locations = await getLocations();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  for (const loc of locations) {
    for (const p of PAGES) {
      entries.push({
        url: `${SITE_URL}/${loc.slug}${p}`,
        lastModified: now,
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 0.9 : 0.6,
      });
    }
  }

  return entries;
}

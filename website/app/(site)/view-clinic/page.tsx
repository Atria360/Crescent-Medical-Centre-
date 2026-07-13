import PageHero from "@/components/site/PageHero";
import { getBlock, getCollection, s } from "@/lib/content";
import { mediaUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = { title: "View Clinic – Crescent Medical Centre" };

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

export default async function GalleryPage() {
  const [block, images] = await Promise.all([
    getBlock("gallery_page"),
    getCollection<GalleryImage>("gallery_images"),
  ]);

  return (
    <>
      <PageHero heading={s(block, "hero_heading")} background={s(block, "hero_background")} />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="section-heading text-center">{s(block, "list_heading")}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <figure key={img.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(img.image_url)}
                alt={img.caption || "Clinic photo"}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {img.caption ? (
                <figcaption className="p-4 text-sm text-brand-body">{img.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

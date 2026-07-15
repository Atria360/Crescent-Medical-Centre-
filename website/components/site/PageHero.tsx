import { mediaUrl } from "@/lib/config";

export default function PageHero({
  heading,
  subheading,
  background,
}: {
  heading: string;
  subheading?: string;
  background?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      {background ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl(background)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-brand-gradient-soft" />
      <div className="hero-in relative mx-auto max-w-7xl px-4 py-20 text-white md:py-28">
        <h1 className="max-w-3xl text-3xl leading-tight md:text-4xl">{heading}</h1>
        {subheading ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed md:text-base">{subheading}</p>
        ) : null}
      </div>
    </section>
  );
}

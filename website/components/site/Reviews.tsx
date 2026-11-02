import { averageRating, type Review } from "@/lib/reviews";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3c-1.65 4.66-6.08 8-11.3 8a12 12 0 1 1 7.96-20.96l5.66-5.66A20 20 0 1 0 24 44c11.05 0 20-8.95 20-20 0-1.34-.14-2.65-.39-3.92Z" />
      <path fill="#FF3D00" d="m6.31 14.69 6.57 4.82A11.99 11.99 0 0 1 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66A19.9 19.9 0 0 0 24 4 20 20 0 0 0 6.31 14.69Z" />
      <path fill="#4CAF50" d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.19-5.24A11.9 11.9 0 0 1 24 36c-5.2 0-9.62-3.32-11.28-7.95l-6.52 5.02A20 20 0 0 0 24 44Z" />
      <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3a12.05 12.05 0 0 1-4.09 5.56l6.19 5.24C39.19 34.99 44 30.09 44 24c0-1.34-.14-2.65-.39-3.92Z" />
    </svg>
  );
}

/**
 * Patient reviews for one clinic. Each location passes its own list, so the
 * Downtown page never shows Westbrook's reviews or vice versa.
 */
export default function Reviews({
  reviews,
  area,
  reviewsUrl,
  heading,
  subheading,
}: {
  reviews: Review[];
  area: string;
  reviewsUrl?: string;
  heading?: string;
  subheading?: string;
}) {
  if (reviews.length === 0) return null;

  const avg = averageRating(reviews);
  const hasGoogle = reviews.some((r) => r.source === "google");

  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading heading-accent text-center" data-reveal>
          {heading || `What Our ${area} Patients Say`}
        </h2>
        <p className="mt-3 text-center text-sm text-brand-body" data-reveal>
          {subheading || "Real feedback from people we care for."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm" data-reveal>
          <Stars rating={Math.round(avg)} />
          <span className="font-bold text-brand-dark">{avg.toFixed(1)}</span>
          <span className="text-brand-body">
            from {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
          {hasGoogle && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-body shadow-sm">
              <GoogleG className="h-3.5 w-3.5" /> on Google
            </span>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r, i) => (
            <figure
              key={r.id}
              className="card flex flex-col p-7 hover:shadow-xl"
              data-reveal
              data-reveal-delay={String((i % 3) + 1)}
            >
              <div className="flex items-center justify-between gap-3">
                <Stars rating={r.rating} />
                {r.source === "google" && <GoogleG />}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-body">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10 text-sm font-bold text-teal">
                  {r.name.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-brand-dark">{r.name}</span>
                  {r.review_date && (
                    <span className="block text-xs text-brand-gray">{r.review_date}</span>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {reviewsUrl && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-brand-dark shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <GoogleG className="h-5 w-5" />
              Read all {area} reviews on Google
            </a>
            <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-teal text-sm">
              Leave us a review
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

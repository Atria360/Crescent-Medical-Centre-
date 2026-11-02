import { getCollection } from "@/lib/content";
import type { Location } from "@/lib/locations";

export interface Review {
  id: string;
  name: string;
  quote: string;
  rating: number;
  /** "google" for a real Google review, "clinic" for one collected directly. */
  source: string;
  /** Free text, e.g. "2 months ago". */
  review_date: string;
  profile_url: string;
}

interface StoredTestimonial {
  id: string;
  name: string;
  quote: string;
  rating?: number;
  source?: string;
  review_date?: string;
  profile_url?: string;
}

/** Google Places (New) review payload — only the fields we display. */
interface PlacesReview {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string };
}

const CACHE_TTL_MS = 10 * 60_000;
const cache = new Map<string, { at: number; reviews: Review[] }>();

/**
 * Reviews for one clinic.
 *
 * Live Google reviews are used when the location has a Place ID **and**
 * GOOGLE_PLACES_API_KEY is configured; the API caps this at five. Otherwise —
 * and whenever the call fails — the reviews stored against this location in the
 * admin panel are shown, so each clinic always displays its own and never the
 * other one's.
 */
export async function getReviews(loc: Location | null): Promise<Review[]> {
  if (!loc) return [];

  const cached = cache.get(loc.slug);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.reviews;

  const live = await fetchGoogleReviews(loc);
  const reviews = live.length > 0 ? live : await getStoredReviews(loc.slug);

  cache.set(loc.slug, { at: Date.now(), reviews });
  return reviews;
}

async function getStoredReviews(slug: string): Promise<Review[]> {
  const rows = await getCollection<StoredTestimonial>("testimonials", { location: slug });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    quote: r.quote,
    rating: clampRating(r.rating),
    source: r.source || "clinic",
    review_date: r.review_date || "",
    profile_url: r.profile_url || "",
  }));
}

async function fetchGoogleReviews(loc: Location): Promise<Review[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = loc.google_place_id?.trim();
  if (!apiKey || !placeId) return [];

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews",
        },
        signal: AbortSignal.timeout(6000),
        // Reviews change slowly; let Next cache the upstream call too.
        next: { revalidate: 600 },
      }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { reviews?: PlacesReview[] };
    return (data.reviews ?? [])
      .map((r, i): Review => {
        const text = r.text?.text ?? r.originalText?.text ?? "";
        return {
          id: r.name || `google-${i}`,
          name: r.authorAttribution?.displayName || "Google reviewer",
          quote: text,
          rating: clampRating(r.rating),
          source: "google",
          review_date: r.relativePublishTimeDescription || "",
          profile_url: r.authorAttribution?.uri || "",
        };
      })
      .filter((r) => r.quote.trim().length > 0);
  } catch {
    return [];
  }
}

function clampRating(value: unknown): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, n));
}

export function averageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

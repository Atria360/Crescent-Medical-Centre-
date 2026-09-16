# Crescent Medical Centre — Full Website Audit (current build)

**Audited:** `website/` (Next.js app) + live Supabase CMS `vhlhwqwsyfspmnfaxfbj` + live media bucket
**Audit date:** 2026-09-16
**Auditor method:** full source read of all 43 source files, clean `tsc --noEmit`, successful `next build` (21 routes), live queries against the production CMS, live checks of storage assets, RLS policies, and auth configuration.

> This document audits **the website we built**. The companion [`SITE_AUDIT.md`](SITE_AUDIT.md) audits the **old WordPress site** it replaced — that one is the content source of truth; this one is the state-of-the-build.

---

## 1. The concept in one paragraph

Crescent Medical Centre is a Calgary family-practice and walk-in clinic that has grown from one location to two. The website's organising idea is **one brand, two self-branded clinics**: a shared root page lets a visitor pick a clinic, and from then on the entire site — logo, colour palette, phone, hours, map, team, fees, chat assistant — re-skins itself to that clinic. Everything a visitor sees is stored in a Supabase CMS and editable by clinic staff through a custom admin panel, with no developer involved. The tone the design is chasing is the one the old site established and the new logo sharpens: *warm, community-rooted, unhurried, accessible* — "Compassionate Care, For Every Life."

## 2. How the concept is implemented

### 2.1 Routing and the location model

```
/                        → clinic chooser (split-screen, each half in its own palette)
/[location]              → that clinic's home page
/[location]/about-us | our-team | medical-services | uninsured-services | faq | contact-us | view-clinic
/admin/*                 → CMS (Supabase-auth gated by middleware)
/api/contact, /api/chat  → form handler, AI assistant
```

- `app/(site)/[location]/layout.tsx` is the whole per-location system: it loads the location row, wraps everything in `themeVars(loc)`, and renders TopBar → Header → page → Footer → FloatingCall → ChatWidget. Any child component that uses `teal` / `brand-red` automatically becomes that clinic's colours.
- `middleware.ts` 301-redirects the seven legacy WordPress paths (`/about-us` …) to `/westbrook/*`, preserving the old site's SEO.
- `generateStaticParams` + `revalidate = 60` → all 18 public pages are statically generated per location and refreshed on a 60-second ISR window.

### 2.2 The theming mechanism (the cleverest part of the build)

Tailwind colours are declared as `rgb(var(--brand-primary) / <alpha-value>)`. Each location row stores five hex values; `lib/locations.ts` converts them to `r g b` triplets and injects them as inline CSS custom properties on a wrapper div. Result: a non-technical admin picks colours in a colour picker and the entire clinic site — buttons, gradients, icons, table headers, accordion, chat bubbles — re-themes, with no rebuild and no CSS edit. `lightenTriplet()` derives the light tint so admins only choose four colours, not six.

### 2.3 Content model (Supabase)

| Kind | Storage | Scoping |
|---|---|---|
| Page sections ("blocks") | `content_blocks(key, data jsonb)` | bare key = primary/shared; `downtown:home_hero` = per-location override, falls back to the bare key |
| Repeating content | `services`, `team_members`, `faqs`, `fee_sections`, `gallery_images`, `testimonials` | `location` column |
| Fee rows | `fee_items` | **no** location column — inherited via `section_id` |
| Enquiries | `messages` | `location` stamp |
| Branding/contact | `locations` | one row per clinic |

`lib/cms-schemas.ts` is the single registry (16 block schemas + 7 collection schemas + location field list) and the admin panel renders every form directly from it — add a field there and it appears in the CMS. This is the right abstraction and it is cleanly done.

### 2.4 Design system

Carried over deliberately from the old site (see `SITE_AUDIT.md` §6) and re-expressed in Tailwind:

| Token | Value | Note |
|---|---|---|
| Primary (Westbrook) | `#3BC4BD` teal, dark `#2FA8A2` | legacy 2023 palette |
| Accent (Westbrook) | `#E22004` red, dark `#C51C03` | legacy |
| Primary (Downtown) | `#06645D` deep teal-green | **new** brand palette |
| Accent (Downtown) | `#0186E6` blue, dark `#012054` navy, gold `#F2C455` | **new** |
| Signature gradient | `linear-gradient(135deg, primary 30%, accent 100%)` | the site's most recognisable device — heroes, banners, CTA cards, chat header |
| Card radius | `20px` | matches the old site's dominant radius |
| Buttons | pill, `border-radius: 50px` | `.btn-white` / `.btn-teal` / `.btn-red` |
| Body type | Montserrat 500 / 14px / `letter-spacing: 1px` | **now actually loaded** — the old site declared Montserrat but never loaded the webfont |
| Button type | Poppins | |
| Display type | EB Garamond italic | stand-in for the new logo's ITC Garamond Light; used for area names and the chooser headline |
| Motion | IntersectionObserver scroll-reveal (`[data-reveal]` + 4 stagger delays), hero entrance, hover lift | `prefers-reduced-motion` respected |

Page rhythm is inherited faithfully from the old home page: hero → three overlapping quick-action cards → solid-colour services band → "Why Choose Us" → team teaser → CTA pair → resources → map.

### 2.5 Functionality rebuilt vs. the old site

| Old | New | Status |
|---|---|---|
| Collect.chat third-party bot | First-party AI assistant (`/api/chat`, Claude Haiku) grounded **only** in that location's services/team/FAQ/hours, with a 60s context cache and a no-medical-advice guardrail | Upgrade |
| WPForms ×2 | `/api/contact` → writes to `messages` **and** emails (Resend, falling back to FormSubmit) | Upgrade |
| Google Maps embed | Per-location embed + "Get Directions" overlay | Parity |
| FAQ accordion | `FaqAccordion` | Parity |
| Header search overlay | — | **Dropped** |
| Cookie-policy popup | — | Dropped (was unverified on the old site) |

Added beyond the old site: `MedicalClinic` JSON-LD per location, dynamic `sitemap.xml`, location memory in `localStorage` with a "Continue to your … clinic" shortcut, a floating call button, and the admin panel itself.

---

## 3. Findings

Severity: **S1** = fix before more traffic reaches the site · **S2** = fix before the Downtown launch is promoted · **S3** = polish.

### S1-1 · Anyone can create an account, then read every patient enquiry and edit the whole site

Public email sign-up is **enabled** on the Supabase project (`/auth/v1/settings` → `"disable_signup": false`), while every privileged RLS policy is scoped to the role `authenticated` with `USING (true)`:

| Table | `authenticated` grant |
|---|---|
| `messages` | SELECT, UPDATE, DELETE |
| `content_blocks`, `services`, `team_members`, `faqs`, `fee_sections`, `fee_items`, `gallery_images`, `testimonials`, `locations` | ALL |
| `storage.objects` (bucket `media`) | INSERT, UPDATE, DELETE |

`middleware.ts` gates `/admin` on nothing more than "a Supabase user session exists". So a stranger who signs up with their own email and confirms it becomes an administrator: they can read the name, email, phone and free-text message of every person who used the contact form (a medical clinic — this is PHIA-sensitive), deface any page, or change the clinic's phone number.

The `media` bucket compounds it: `file_size_limit: null`, `allowed_mime_types: null`, so the same account can upload arbitrary files of any type and size to a URL on the clinic's domain.

*Nothing has leaked yet* — `messages` currently holds 0 rows and `auth.users` holds only the 2 legitimate accounts. This is exposure, not a breach.

**Fix:** turn off public sign-up (Dashboard → Authentication → Sign In / Providers → disable "Allow new users to sign up") and create staff accounts by invitation. Then, defence in depth: add an `admins` table (or a JWT claim) and re-scope every policy from `authenticated` to "is an admin", set a `file_size_limit` and an image-only `allowed_mime_types` on the bucket, and have the middleware check admin status rather than mere authentication.

### S1-2 · The Downtown clinic advertises the Westbrook clinic's doctors, fees and phone number

Downtown's collections are an exact clone of Westbrook's — same 7 physicians, same supervisor, same 5 medical assistants, same 17 services, same 13 FAQs, same 3 fee tables, same gallery, same testimonials. Two concrete consequences on the live site today:

- `/downtown/our-team` lists all seven Westbrook physicians with bios, implying they practise downtown.
- `/downtown/faq` → "How do I schedule an appointment?" answers **"call us at 587-318-1608 or emailtocrescent@gmail.com"** — Westbrook's number and inbox, on the Downtown site, directly contradicting the Downtown header/footer which show `825 395 4309` and `info@crescentmedical.ca`.

The page-section blocks *were* localised properly (Downtown's About copy correctly describes 909 5 Avenue SW and the CTrain), which makes the un-localised collections stand out more, not less.

**Fix:** before Downtown is promoted anywhere, have the clinic confirm the real Downtown roster, service list and fee schedule, then prune `team_members`, `faqs`, `services`, `fee_sections`/`fee_items`, `gallery_images` and `testimonials` for `location = 'downtown'`. Where content genuinely is shared (most FAQs), edit the two answers that hard-code Westbrook contact details.

### S1-3 · The largest fee table is missing from both locations

`scripts/seed.mjs` defines four fee tables; the live database has **three** per location. The missing one is "Other Uninsured Services" — 21 rows, the longest and most-consulted list, containing the prescription-renewal fee, the office visit without valid coverage, chart copies, record transfer, wart/mole removal, the travel-injection fee, and **both no-show / late-cancellation fees ($50 and $125)**.

Patients are currently quoted cancellation fees in the FAQ ("a fee may apply … see our Uninsured Services page") and then find no such fee on that page. A posted fee schedule is also what the clinic relies on to charge these amounts.

**Fix:** re-add the table (the 21 rows are already written out verbatim in `scripts/seed.mjs` §6 and in `SITE_AUDIT.md` §4.5, Table 4) for both locations, reconciling the price conflicts flagged in `SITE_AUDIT.md` §4.5 first.

### S2-1 · Two clinics of one brand are running two different logos and two different palettes

Westbrook serves the 2023 logo (red crescent + teal caduceus, grey serif wordmark) on the legacy `#3BC4BD`/`#E22004` teal-and-red palette. Downtown serves the new identity (navy/teal crescent-cross-hand mark, gold star, Garamond wordmark) on the new `#06645D`/`#0186E6`/`#012054`/`#F2C455` palette. Side by side on the chooser page, they do not read as the same organisation.

Three high-resolution masters of the new identity sit uncommitted-to-the-site at the repo root (`Crescent Medical Center high quality JPG file-01-01.jpg`, `Transparent PNG - usable everywhere.-01-01.png`, and a mono version carrying the tagline **"Compassionate Care, For Every Life."**). The build is already half-prepared for the rebrand: `EB_Garamond` is loaded and commented as *"a free stand-in for the brand's ITC Garamond Light"*, and `--brand-gold` exists in the token set.

The per-location theming makes this a content change, not a code change.

**Decision needed from the clinic:** roll the new identity out to Westbrook too (recommended — upload the transparent PNG as Westbrook's logo and move its palette to the new tokens), or keep the two deliberately distinct. Also decide whether the new tagline replaces the inherited footer line *"Take your first step towards happiness with Canada's Trusted Wellness Hub…"*.

### S2-2 · Every subpage has the same `<title>` on both locations

`app/(site)/[location]/*/page.tsx` export a static `metadata` object — e.g. `title: "About Us – Crescent Medical Centre"` — which overrides the location-aware `generateMetadata` in the layout. So `/westbrook/about-us` and `/downtown/about-us` ship identical titles and no descriptions, as do all six other subpage pairs. For a business whose entire SEO value is *local* search, this throws away the strongest ranking signal and creates 7 pairs of duplicate titles.

**Fix:** replace each static `metadata` with a `generateMetadata({ params })` that reads the location and emits e.g. `"About Us — Crescent Medical Centre, Downtown Calgary"` plus a location-specific description. ~15 lines per page, or one shared helper.

### S2-3 · Placeholder content is live on both clinics

Flagged in `SITE_AUDIT.md` as "verify with client before reuse" and carried into production unchanged:

- **Testimonials** — "Sarah Johnson", "David Wong", "Emily Anderson" on `/westbrook/about-us` *and* `/downtown/about-us`. Invented patient testimonials on a medical site are a real credibility and advertising-standards risk.
- **Gallery** — all five `/view-clinic` images on both locations are the 2023 **AI-generated JasperArt renders**, not photographs of either clinic. Downtown's gallery therefore shows AI pictures of a clinic that isn't Downtown.
- **COVID-era framing** — the Additional Resources section still opens "Feeling stress, anxiety and depression due to the COVID-19 crisis?" on both locations. The underlying links (Text4Hope, MyHealth Alberta, Health Link 811, Access Mental Health) are still good; the framing is dated.
- **Careers card** — the Contact page's "Our Healthcare Family — Explore career opportunities with us" card survives from the old site, but there is no careers page and the card isn't a link, so it's a dead-end promise.

**Fix:** replace testimonials with real Google reviews (the review CTA already exists), commission photographs of both clinics, re-title the resources section, and either build a careers page or drop the card.

### S2-4 · Images are served unoptimised at full resolution

No `next/image` anywhere — every image is a raw `<img>` with the ESLint rule disabled, pointing straight at Supabase Storage. Measured from the live bucket:

| Page | What it loads |
|---|---|
| `/[location]` home | 4 doctor photos at full size into 300 px slots — `Dr.Amira_.jpg` alone is **739 KB**, `Dr-Oluwafunso_phots-1.png` is **1.35 MB** |
| `/[location]/our-team` | 13 photos, several >800 KB, into 256×256 and 200×200 slots |
| `/[location]/view-clinic` | 5 gallery JPEGs, up to **1.1 MB** each |

That is multi-megabyte pages for mobile patients on cellular — the audience most likely to be looking up a walk-in clinic.

**Fix:** switch to `next/image` with `remotePatterns` for the Supabase host (it will resize, convert to WebP/AVIF and lazy-load automatically), and set `priority` on the hero. Even without that, re-exporting the team photos at ~600 px would cut the home page by several MB.

### S2-5 · The contact endpoint has no abuse protection

`/api/contact` is an unauthenticated public endpoint that writes a row to the database **and** triggers an outbound email per request, with no honeypot field, no CAPTCHA, no rate limit and no size cap on `message`. A trivial script can fill the admin inbox and burn the email quota (and, on FormSubmit's free relay, get the clinic's address throttled).

**Fix:** add a hidden honeypot input, a per-IP rate limit (Vercel KV or Upstash), and a length cap on `message` and `name`.

### S3 · Smaller items

1. **`revalidate = 60` vs. the promise in the admin.** The dashboard and every editor say *"Changes go live immediately"* / *"Saved ✓ — live on the site"*, but ISR means up to 60 seconds, and longer for a page no one has requested. Either soften the wording, or call `revalidatePath()` from a save action.
2. **No `robots.txt`.** There's a `sitemap.ts` but no `robots.ts`, so nothing points crawlers at the sitemap and `/admin` isn't disallowed.
3. **Accessibility gaps.** The FAQ accordion buttons have no `aria-expanded`/`aria-controls`; the mobile menu and location-switcher buttons have no `aria-expanded`; the location-switcher dropdown doesn't close on outside click or Escape and isn't keyboard-dismissible. All are small, self-contained fixes.
4. **Colour contrast worth measuring.** White body text on the `#3BC4BD` teal services band, and the teal-on-white `.btn-white` label, are both likely under WCAG AA at 14 px. The Downtown palette's deeper `#06645D` is comfortably fine — another argument for S2-1.
5. **Legacy URLs take two hops.** The middleware matcher lists `/about-us` etc. without trailing slashes; the old WordPress URLs all ended in `/`, so inbound links hit Next's trailing-slash normalisation first, then the 301. Harmless but worth a single-hop rule.
6. **Unscoped fee-item fetch.** `uninsured-services/page.tsx` calls `getCollection("fee_items")` with no location filter and filters by `section_id` in JS, so each location's page downloads both locations' fee rows. Correct today, wasteful, and it will scale badly at 4+ clinics.
7. **Hard-coded Supabase fallbacks.** `lib/config.ts` falls back to the literal project URL and anon key when the env vars are absent. The anon key is public by design so this isn't a leak, but a production deploy that forgets `NEXT_PUBLIC_SUPABASE_URL` will silently point at this project rather than failing loudly. Same for `SITE_URL`, which defaults to a `*.vercel.app` origin that will end up in the sitemap and JSON-LD if unset.
8. **Downtown has no map, directions, reviews link or social links.** `map_embed_src`, `directions_url`, `google_reviews_url`, `facebook`, `instagram` are all empty, so the Downtown home and contact pages silently render no map section at all and the "Review us on Google" button falls back to a generic Maps *search*. Both locations also have an empty `hero_image`, so the chooser's split hero shows flat gradient panels instead of the intended photographs.
9. **Dropped feature.** The old site's header search overlay has no equivalent. Probably fine for an 8-page site — noting it so the omission is a decision, not an oversight.

---

## 4. What is in good shape

Worth saying plainly, because most of this build is solid:

- `tsc --noEmit` is clean and `next build` produces all 21 routes with no warnings.
- The theming architecture is genuinely well-designed — one abstraction, honestly applied, that turns a brand rollout into a CMS edit.
- The schema-driven CMS means the admin panel can't drift from the site's fields.
- RLS is enabled on every table with sensible read/write separation — the S1-1 problem is the *definition of who counts as staff*, not a missing policy.
- The chat assistant is correctly scoped: per-location context only, explicit refusal to give medical advice, emergency routing to 911, a graceful fallback when `ANTHROPIC_API_KEY` is absent, prompt caching, and message/-length caps to bound cost.
- The contact route degrades well: it succeeds if *either* the database write or the email delivery works, and only fails when both do.
- Legacy URL redirects, per-location JSON-LD, and the dynamic sitemap mean the migration doesn't lose the old site's search equity.
- `prefers-reduced-motion` is honoured throughout.

---

## 5. Recommended order of work

1. Disable public sign-up on Supabase — one dashboard toggle, closes S1-1's exploitable half today.
2. Fix Downtown's cloned roster, FAQs and contact details (S1-2), and restore the missing fee table (S1-3).
3. Decide the brand question (S2-1); if the new identity wins, it's a logo upload and five colour fields per location.
4. Location-aware page metadata (S2-2) and `robots.ts` (S3-2).
5. Replace placeholder testimonials and AI gallery images (S2-3).
6. `next/image` migration (S2-4) and contact-form abuse protection (S2-5).
7. Re-scope RLS to a real admin role (S1-1, second half) and the accessibility pass (S3-3).

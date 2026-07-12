# Crescent Medical Centre — Website Content Audit

**Site:** https://crescentmedical.ca/
**Audit date:** 2026-07-12 (direct crawl completed)
**Purpose:** Capture all pages and content of the existing (old) website so a new website can be rebuilt from scratch with matching data. No code has been written yet — this is the content-gathering phase.

---

## ⚠️ How this audit was collected

- **Sessions 1–2 (2026-07-12):** the sandbox egress policy blocked all direct fetches; content was recovered from search-engine snippets only, and every item in §9 was open.
- **Session 3 (2026-07-12, this revision):** network access was enabled and a **full direct crawl succeeded** (HTTP 200 on every page, `robots.txt`, and `wp-sitemap.xml`). All 10 gaps in §9 are now resolved. Verbatim text extracts of the live pages are committed alongside this file in [`audit/pages/`](pages/).

The direct crawl also revealed that **the site has been updated since the search snippets were indexed** — the team roster changed, the `/new-team-member/` pages were removed, and some copy differs. Everything below reflects the **live site as of 2026-07-12**; differences from the snippet-based draft are flagged inline.

---

## 1. Site identity & platform

| Item | Value |
|---|---|
| Business name | Crescent Medical Centre (site title shows "Crescent Medicals") |
| Type | Family practice / walk-in medical clinic |
| Location | 923 37 Street SW, Calgary, AB T3C 1S4 (SW Calgary, 37th Street just south of Bow Trail, near Westbrook Mall and Westbrook LRT station) |
| Platform | WordPress 6.9.4 + **Elementor** page builder + **pixfort "Essentials" theme** (`wp-content/themes/essentials`) |
| Plugins in evidence | WPForms (contact forms), Revolution Slider, Master Slider, Essential Addons for Elementor, WP-SCSS |
| Tagline / hero | "Greetings from Crescent Medical Center – Where Your Health is Our Priority!" / "Take the first step towards your well-being" |
| Footer tagline | "Take your first step towards happiness with Canada's Trusted Wellness Hub – Your Destination for a Healthier You" |
| Copyright (footer) | "Crescent Medicals © All rights reserved" |
| Chatbot | **Collect.chat** embedded widget (`collectcdn.com/embed.js`, widget id `652d9ba6df70161214caab93`) — 24/7 scheduling/enquiry bot |
| Online booking | "Book Appointment" buttons link to `/contact-us/` (the previously referenced Cortico link no longer appears anywhere on the site) |
| Social (header/footer icons) | Facebook: facebook.com/crescentmedical.ca · Instagram: instagram.com/crescentmedical.ca |
| Favicon | `wp-content/uploads/2023/10/cropped-02-*.png` (32/180/192 px) |

## 2. Contact information

| Item | Value |
|---|---|
| Address | 923 37 Street SW, Calgary, AB T3C 1S4 |
| Phone | 587-318-1608 |
| Toll-free | (877) 419-1619 ("Dial Toll free Number (877) 419-1619 from anywhere in Canada") |
| Email (appointments/general) | emailtocrescent@gmail.com |
| Email (business enquiries) | imcrescentmedcentre@gmail.com |
| **Clinic hours (verbatim, footer of every page)** | **Monday – Friday 9 am – 6 pm · Saturday 10 am – 3 pm** (Sunday not listed → closed). Accompanying line: "We operate on Saturdays and also accommodate walk-in appointments." |
| Walk-in hours | Walk-in patients accepted **9am–3pm** daily (wait time can be up to 45–60 min) |
| Top bar (every page) | "Emergency Call 911" · "Medical Advice Call 811" · clinic phone |

## 3. Page inventory (from `wp-sitemap.xml` + crawl)

### Live content pages (rebuild these)
| # | URL | Page title | Status |
|---|---|---|---|
| 1 | `/` | Crescent Medicals (Home) | ✅ Captured verbatim ([text](pages/home.txt)) |
| 2 | `/about-us/` | About Us – Crescent Medicals | ✅ Captured ([text](pages/about-us.txt)) |
| 3 | `/our-team/` | Our Team – Crescent Medicals | ✅ Captured ([text](pages/our-team.txt)) |
| 4 | `/medical-services/` | Medical Services – Crescent Medicals | ✅ Captured ([text](pages/medical-services.txt)) |
| 5 | `/uninsured-services/` | Uninsured Services – Crescent Medicals | ✅ Captured **incl. full price tables** ([text](pages/uninsured-services.txt)) |
| 6 | `/faq/` | FAQ – Crescent Medicals | ✅ Captured ([text](pages/faq.txt)) |
| 7 | `/contact-us/` | Contact Us – Crescent Medicals | ✅ Captured ([text](pages/contact-us.txt)) |
| 8 | `/view-clinic/` | View Clinic – Crescent Medicals | ✅ Captured — it's in the main nav, a photo "Gallery" page ([text](pages/view-clinic.txt)) |

**Removed since the snippet-based draft:** `/new-team-member/christine-kang/` and `/new-team-member/yaara-eilon-avigdor/` now return **404**. Team bios live inline on `/our-team/` only. Dr. Christine Kang, Maria (psychologist), and Yaara Eilon-Avigdor (physiotherapist) **no longer appear on the site at all**.

### Theme-demo / leftover pages (do NOT rebuild)
All still live but contain pixfort-theme demo content, not clinic content:
`/homepage-original/`, `/home-page/`, `/about-extended/`, `/about-simple/`, `/services/`, `/pricing-simple/`, `/pricing-creative/`, `/contact-us-simple/`, `/contact-us-extended/`, `/careers/` + `/career-page/` (fake web-agency job listings, lorem ipsum), `/terms-of-service/` (**PixFort's own ToS text** — references pixfort.com), `/wishlist/`, `/features/`, `/features-element/`, `/coming-soon/`, `/product-showcase/`, `/products-carousel/`, `/shop-categories/`, 13 `/portfolio-item/…` pages, and 5 demo blog posts (`/hello-world-this-is-essentials-theme/` etc.).

⚠️ Note: the contact page's "Our Healthcare Family — Explore career opportunities with us" card links toward the **demo** careers page. On rebuild, either build a real careers page or drop the card.

**Blog:** no real posts exist — only the 5 theme demo posts. (Gap #10 resolved.)

## 4. Per-page content (live pages)

> Full verbatim text of every section is in [`audit/pages/`](pages/). Highlights and structure below.

### 4.1 Home (`/`)
1. **Hero:** "Greetings from Crescent Medical Center – Where Your Health is Our Priority!" / "Take the first step towards your well-being" (hero image `2023/11/001.jpg`; Master Slider / Revolution Slider assets loaded).
2. **Quick action cards:** Book Appointment · Book Health Checkup · Consult Online (SVG icons; buttons link to `/contact-us/`).
3. **"Explore Our Comprehensive Medical Care Services Options"** — intro + 9 featured service tiles: Routine Appointments, Walk-in Appointments, Annual Physical Exam, Women's Health, STI Screening, Men's Health, Seniors Services, Wounds Laceration, Driver's Medical.
4. **"Why Choose Us..?"** — 4 tabs: Expert Care Community Rooted / Convenience & Access / Patient-Centered & Affordable / Quality & Trust (copy in [pages/home.txt](pages/home.txt)).
5. **"Our Team"** teaser — 4 doctor cards with photos: Dr. Amira Sultana Imdadullah (MBBS CCFP DGO), Dr. Luisa Fernanda Caro (MD MCFP), Dr. Ulya Ansari (MBBS CCFP), Dr. Saumya Selvaraj (MD CCFP).
6. **"Connect with Our Chatbot"** — 24/7 chatbot copy.
7. **"BUSINESS ENQUIRIES"** — mailto: imcrescentmedcentre@gmail.com.
8. **"Additional Resources"** (large section, COVID-era mental-health resources — decide whether to keep):
   - Text4Hope (text COVID19HOPE to 393939)
   - MyHealth Alberta: Health A-Z, Symptom Checker, Tests & Treatments (links to myhealth.alberta.ca)
   - Health Link 811
   - Access Mental Health (Calgary) — 403.943.1500
   - UpToDate patient education
   - Choosing Wisely Canada
   - SCPCN PDFs: Calgary Resource Guide, Helpful Websites, Free Food in Calgary Handout, Mental-health phone apps
9. **"Our Location"** — Google Maps embed (place: "Crescent Medical Centre").

### 4.2 About Us (`/about-us/`)
- Hero repeats the greeting + "Join over +15,000 happy clients!"
- **Get To Know Us:** SW Calgary / 37th Street / Bow Trail / Westbrook Mall / Westbrook LRT copy; bullets "Top-notch Family Practice", "Walk-ins Welcome!"
- **OUR MISSION** (3 bullets): Accessible and Compassionate Service · Excellence in Health and Wellness · Empowering Patients ("…empower our patients with knowledge and choices, fostering active participation in their healthcare journey").
- **Vision:** "…a future where healthcare is accessible, inclusive, and personalized, empowering individuals to lead healthier lives through innovative medical solutions and compassionate care."
- **Strategic Goals** (2 bullets): patient-centric care via technology + human-centric approaches; community impact via health education, local partnerships, preventive-care advocacy.
- **Testimonials:** Sarah Johnson, David Wong, Emily Anderson (generic names — likely placeholder; verify with client before reuse).
- ⚠️ Contains a leftover **theme demo client-logo strip** (Netflix, PayPal, Square, Mailchimp, Intercom, pixfort) — drop on rebuild.
- Images: `mission.jpeg`, `vision-goals.jpeg`.

### 4.3 Our Team (`/our-team/`) — **roster changed vs. snippet draft**

**Family physicians (7), verbatim bios in [pages/our-team.txt](pages/our-team.txt):**
1. **Dr. Amira Sultana Imdadullah** — MBBS CCFP DGO. Medical degree India, diploma from Dublin; family/emergency medicine, OB-GYN, mental health counseling, geriatric care; speaks English, Hindi, Urdu, Kanada [sic], Tamil, Arabic.
2. **Dr. Luisa Fernanda Caro** — MD MCFP. *(New — not in snippet draft.)* From Bogotá, Colombia; residency in Family Medicine at University of Calgary. Child & adolescent health, women's health, mental health; supports refugee integration.
3. **Dr. Ulya Ansari** — MBBS CCFP. Canada/India/Middle East background; family & emergency medicine, OB-GYN, mental health, geriatric & palliative care, minor surgical procedures; speaks English, Urdu, Hindi, Marathi, Arabic.
4. **Dr. Saumya Selvaraj** — MD CCFP. From Saskatoon; U of C residency; preventive health, women's & youth health, nutrition/weight management; trained in Botox administration (migraines, hyperhidrosis, cosmetics).
5. **Dr. Adina Constantinescu** — MD CCFP COE. Calgary native, U of C; family medicine incl. obstetrics, gynecology, pediatrics; Care of the Elderly, dementia care, long-term care, wound care.
6. **Dr. Saad Yasin** — MBBS CCFP MRCGP. Clinical Assistant Professor, U of C Cumming School of Medicine; Jinnah Sindh Medical University 1998; UK GP training 2005, MRCGP 2006; president of APPNA Alberta Chapter.
7. **Dr Oluwafunso Oluwabamise (Andrew)** — MBCHB MRCGP. UK-trained; urgent/primary/hospital care incl. obstetrics, gynecology, psychiatry, pediatrics; palliative care. Full-time at Crescent from 1st week of March 2025; **accepting new patients and walk-ins**. *(The snippet draft listed "Dr. Andrew" and "Dr. Oluwafunso" as two people — they are one person.)*

**Clinic staff:**
8. **Irish Alimios** — SW Clinic Supervisor (Medical Office Supervisor).
9. **Medical Assistants:** Faye Awan, Elaine Pabilonia, Monica, Lavinia Francisco, Mariel Pabilonia (photo cards, no bios).

**No longer on the site:** Dr. Christine Y. Kang, Maria (Primary Care Registered Psychologist), Yaara Eilon-Avigdor (physiotherapist). Note `/medical-services/` still lists Physiotherapy and Mental Health as services — confirm with the clinic whether these bios should return.

### 4.4 Medical Services (`/medical-services/`) — exact card list (17)
Hero: "Your Health is Our Priority / Experience Unmatched Healthcare Excellence. Your Path to Health and Healing Begins Here at Crescent Medical Care Center."

Each card = photo + title + one-liner (verbatim in [pages/medical-services.txt](pages/medical-services.txt)):
1. Routine Appointments — "Your regular check-ins for ongoing health maintenance"
2. Walk-in Appointments — "Convenient on-the-spot healthcare for immediate needs"
3. Annual Physical Exam — "A comprehensive yearly checkup to monitor your health"
4. Child Health Services — "Expert care tailored to your child's well-being"
5. Women's Health — "Specialized support for women's unique health needs"
6. STI Screening — "Confidential screenings to ensure your sexual health"
7. Men's Health — "Comprehensive care addressing men's specific health concerns"
8. Immunization — "Vaccines to protect you and your loved ones from preventable diseases"
9. Seniors Services — "Tailored healthcare for a healthy and vibrant senior life"
10. Wounds Laceration — "Expert care to heal wounds and lacerations quickly"
11. Driver's Medical — "Ensuring you meet medical standards for safe driving"
12. WCB — "Supporting you through Workers' Compensation Board assessments"
13. Physiotherapy — "Rehabilitation and pain relief through specialized therapy"
14. Mental Health — "Compassionate care to address your mental well-being"
15. Prenatal Care — "Guiding expectant mothers through a healthy pregnancy journey"
16. Refugee Services — "Specialized support for refugees as they adapt to a new life"
17. Eye Disorders — "Specialized Eye disease screening Covered by Alberta Health Care" (Euclid Telehealth)

### 4.5 Uninsured Services (`/uninsured-services/`) — **full price tables captured (gap #1 closed)**

Intro (verbatim): "Alberta Health Care Plan covers many of the services patients receive from their doctors. However, several services are not covered by the government plan. These are uninsured services, some are billed to lawyers, government agencies or others. Some are billed to the patient. Following are some of the uninsured services billed to the patient with approx. cost for guidance. Contact Clinic for further details."

**Table 1 — Notes & certificates**
| Service | Cost |
|---|---|
| Note of Illness (e.g., Fit to Work/Return to Work/Work Absence, Illness of Certificate) | $25 |
| Note (e.g., Massage Therapy/Acupuncture/Chiropractic) | $25 |
| Medical Certificate | $50 |
| Senior's Residence Medical Report | $100 |
| Disabled Parking Form | $100 |

**Table 2 — Certification of Fitness for Summer Camp, Daycare, Air Travel etc.**
| Service | Cost |
|---|---|
| Form Completion Only | $50 |
| Examination and Form Completion | $125 |

**Table 3 — General Insurance Eligibility**
| Service | Cost |
|---|---|
| Blue Cross Special Authorization Forms * Any Drug Authorization Form | $50 |
| Driver's Medical Exam | $135 |
| Other Simple Forms (Employment Insurance, Pregnancy Leave) | $100 |
| Examination and Form Completion (e.g., AISH, Pre-Employment, Pre-Op Medical) | $125 – $275 |
| Third-Party Requested Letters on Patient Attended | $275 |
| Attending Physician's Statement (For Insurance Only) | $275 |
| Medical Legal Report | $175 – $275 |

**Table 4 — Extended fee list**
| Service | Cost |
|---|---|
| Prescription renewals requested outside of an office visit (phone, fax, online) | $50 |
| Note of fitness for school, daycare, camps – note only | $50 |
| Note of fitness for school, daycare, camps – examination and note | $125 |
| Sick note | $25 |
| Without valid Health Care Coverage (office visit) | $50 |
| Complete Physical (Without Valid Health Care Coverage) | $100 |
| Non Resident of Canada Patient Medical Assessment | $125 |
| Seniors' residence medical report | $50 |
| Disabled parking authorization | $50 |
| Driver's medical | $125 |
| Pre-employment medical examination and report | $125 |
| Pregnancy leave and Employment Insurance forms | $50 |
| AISH application | $100 |
| Blue Cross Special Authorization forms | $50 |
| General insurance eligibility | $275 |
| Attending physician's statement (for insurance company) | $275 |
| Disability benefit report | $125 |
| Third-party requested letters on patient attended | $275 |
| Canada Revenue Agency disability tax credit | $75 |
| Medical legal report | $300 / hr |
| Chart Copies | $275 |
| Removal of warts, moles, etc., not medically required (uncomplicated) – surgical treatment | $125 |
| Non-surgical treatment (removal via liquid nitrogen, chemicals, etc.) | $50 |
| Uninsured Injection (Gardasil or Tetnus [sic] for Travel) | $20 |
| Photocopy Fee / Copy of results | $5 + 0.25 / page |
| Record Transfer | $50 |
| No Show / Cancellation 24 Hours – regular appointment | $50 |
| No Show / Cancellation < 24 Hours – longer than 15 minutes appointment | $125 |

⚠️ Tables 1–3 and Table 4 **overlap with conflicting prices** (e.g., Senior's Residence Medical Report $100 vs $50; Disabled Parking $100 vs $50; Driver's Medical $135 vs $125; Medical Legal $175–275 vs $300/hr). Reproduce as-is or have the clinic reconcile before rebuild.

### 4.6 FAQ (`/faq/`) — 13 Q&As, verbatim in [pages/faq.txt](pages/faq.txt)
1. How do I schedule an appointment? — call 587-318-1608 or emailtocrescent@gmail.com.
2. Do you accept walk-in patients? — 9am–3pm, wait up to 45–60 min.
3. How do I cancel or reschedule? — 24h notice; fee for last-minute cancellations.
4. Medical emergency? — dial 911 (interpreter available).
5. What is Euclid Telehealth? — monthly on-site 20-min non-invasive eye screening covered by Alberta Health Care; book at euclidtelehealth.org/crescent, patientsupport@euclidtelehealth.org, 1-800-511-5661.
6. Which doctor is available today? — call; walk-ins welcome daily; book for a specific doctor.
7. Approximate wait time? — varies; same-day appointments available; **check walk-in wait times on Medi-Map**.
8. Disability-related forms? — AISH, disability tax credit, MVA insurance, parking placard; in-person appointment required; pay before departure.
9. Prescription refills by phone/fax? — no; in-person visit required.
10. Test results over the phone? — no (Health Information Act); reviewed in person.
11. Appointment or walk-in? — walk-ins daily, appointments take precedence; same-day if available.
12. First visit? — bring "Crescent Health Card" [sic — Alberta Health Card] and government ID.
13. Can't make an appointment? — notify 24h ahead; "There's no fee for missed appointments." ⚠️ Contradicts Q3 and the $50/$125 no-show fees on the Uninsured Services page — flag to clinic.

*(The snippet-draft FAQ "family doctors are currently NOT accepting new patients" is no longer on the live page.)*

### 4.7 Contact Us (`/contact-us/`)
- Hero: "At Your Service - Contact Us Today for a Healthier Tomorrow!"
- 4 info cards: Your Lifeline to Health (toll-free) · Our Healthcare Family (careers → ⚠️ demo page) · Book online appointment · Find Us (address + phones).
- **Form 1 (WPForms id 14662):** Select Subject* (Book An Appointment / Request an Enquiry / Others), Name*, Email*, Phone*, Message (optional), Submit. AJAX post to `/contact-us/`.
- **Form 2 (WPForms id 17053, "Share Your Feedback"):** Name*, Email*, Phone*, Message (optional), Submit.
- Feature strip: Book Appointment / Consult Online / Book Health Check / Find Hospital ("Find Directions & contact details").
- Google Maps iframe embed (Crescent Medical Centre pin) + large clinic image `2023/11/01-e1700484967566.png`.
- No hours table on this page — hours live in the global footer (see §2).

### 4.8 View Clinic (`/view-clinic/`)
- "Our Gallery" — 5 gallery images, all **AI-generated (JasperArt)** interior renders, not real photos: `JasperArt_2023-11-10_*.jpg`. Recommend replacing with real clinic photography on rebuild.

## 5. Global layout (verified)

- **Top bar (every page):** "Emergency Call 911" · "Medical Advice Call 811" · phone 587-318-1608 · social icons (Facebook, Instagram).
- **Header nav (exact order):** Medical Services · Uninsured Services · Our Team · View Clinic · About Us · Contact Us · FAQ. Logo (top-left) links Home. Search overlay ("Hit enter to search or ESC to close").
- **Footer:** tagline line ("Take your first step towards happiness with Canada's Trusted Wellness Hub…"), then 3 columns:
  - **"Sevices"** [sic — typo on live site]: Medical Services · Uninsured Services · Contact Us
  - **"Quick Links":** Home · About Us · Gallery (→ `/view-clinic/`) · FAQ
  - **"Locate Us":** address · "We operate on Saturdays and also accommodate walk-in appointments." · Clinic Hours (Mon–Fri 9 am – 6 pm, Sat 10 am – 3 pm) · Phone · Toll Free
  - Bottom line: "Crescent Medicals © All rights reserved"

## 6. Design tokens (gap #9 closed)

| Token | Value |
|---|---|
| Theme | pixfort **Essentials** (Elementor-based) |
| Elementor global primary | `#E22004` (red) |
| Elementor global secondary | `#3BC4BD` (teal) |
| Elementor global text | `#7A7A7A` |
| Elementor global accent | `#61CE70` (green) |
| Extra kit colors | `#3BC4BD` (c17cb69), `#E22004` (f6a29f1) |
| Global fonts (Elementor) | Roboto (primary/text/accent), Roboto Slab (secondary) |
| Theme-enqueued fonts | Manrope 400/700, Poppins 400/700 (Google Fonts) |
| Logo (header) | `wp-content/uploads/2023/10/logo.png` |
| Logo (footer, white) | `wp-content/uploads/2023/10/creasent-logo-white.png` [sic filename] |
| Favicon | `wp-content/uploads/2023/10/cropped-02-{32,180,192}.png` |

## 7. Image inventory (gap #3 closed)

All under `https://crescentmedical.ca/wp-content/uploads/`:

- **Branding:** `2023/10/logo.png`, `2023/10/creasent-logo-white.png`, `2023/10/cropped-02-*.png` (favicon)
- **Home:** `2023/11/001.jpg` (hero), `2023/10/bookappt_icon.svg`, `2023/10/bookhelathcheck_icon.svg`, `2023/10/buymedicines_icon.svg`, `2023/11/other-resources.jpeg`
- **About:** `2023/11/mission.jpeg`, `2023/11/vision-goals.jpeg`
- **Team photos:** `2023/11/Dr.Amira_.jpg`, `2023/11/Luisa-Caro-scaled.jpg`, `2023/12/Dr-Ansari-ddd.jpg` / `2023/11/Dr.Ulya-Ansari-scaled.jpg`, `2023/11/Saumya-Selvaraj.jpg`, `2023/12/Un-300x300.jpg` (Dr. Constantinescu), `2023/11/yasin-888x1024-1.jpg`, `2025/04/Dr-Oluwafunso_phots-1.png`, `2025/04/Irish_Supervisor.png`, `2025/04/Faye_MOA.png`, `2025/04/Elaine_MOA.png`, `2025/04/Monica_MOA.png`, `2023/11/Lavinia.jpg`, `2023/10/nina-mabugat-400x400.jpg` (Mariel card)
- **Service cards (17):** `2023/11/Routine-Appointments-min.jpg`, `Walk-in-appointets-min.jpg`, `Annual-Physical-Exam-min.jpg`, `Child-Health-Services-min.jpg`, `Womens-Health-min.jpg`, `sti-screening-min.jpg`, `mens-health-min.jpg`, `immunization-min.jpg`, `senior-services-min.jpg`, `wound-laceration-min.jpg`, `Drivers-Medical-min.jpg`, `Wcb-min.jpg`, `Physioteraphy-min.jpg`, `mental-helath-min.jpg`, `prenatal-care-min.jpg`, `refuge-services-min.jpg`, `eye-disorders-min.jpg`
- **Gallery (AI-generated):** `2023/11/JasperArt_2023-11-10_13.14.03_upscaled.jpg`, `…13.16.27_upscaled-1.jpg`, `…14.34.19_upscaled-1.jpg`, `…14.35.19_upscaled.jpg`, `…14.42.12_upscaled.jpg`
- **Contact:** `2023/11/01-e1700484967566-613x1024.png`
- ⚠️ Demo-only (don't reuse): `2023/10/{netflix,paypal,square,mailchimp,intercom,pixfort}.png`

## 8. Integrations / functionality to reproduce

1. **Collect.chat** chatbot widget (24/7 booking/enquiry) — id `652d9ba6df70161214caab93`
2. **WPForms**-style contact forms ×2 (subject dropdown + feedback form), AJAX submit
3. **Google Maps** embed (Crescent Medical Centre pin)
4. FAQ accordion (13 items)
5. Search overlay in header
6. External resource links: MyHealth Alberta, Health Link 811, Text4Hope, Access Mental Health, UpToDate, Choosing Wisely Canada, SCPCN PDF handouts, Euclid Telehealth (euclidtelehealth.org/crescent)
7. Cookie-policy popup post type exists in sitemap (`/pixpopup-item/cookie-policy-popup*`) — verify whether active

## 9. Third-party presence (reference data, not site content)

- Euclid Telehealth partner page: https://euclidtelehealth.org/crescent
- Medimap (FAQ tells patients to check walk-in wait times there)
- Facebook: facebook.com/crescentmedical.ca · Instagram: instagram.com/crescentmedical.ca (older draft referenced facebook.com/crescentmedcentre — verify which is current)
- Cortico booking page existed historically but is no longer linked from the site

## 10. Gaps — resolution status

All 10 items from the earlier snippet-based audit are **resolved** by the 2026-07-12 direct crawl:

1. ✅ Uninsured price table — captured in full (§4.5)
2. ✅ Clinic hours — Mon–Fri 9–6, Sat 10–3, Sun closed (global footer; §2)
3. ✅ Images — full inventory with URLs (§7)
4. ✅ Verbatim copy — extracts committed in `audit/pages/`
5. ✅ Contact form fields — two WPForms forms documented (§4.7)
6. ✅ Header/footer nav order, top bar, social icons (§5)
7. ✅ Chatbot vendor — Collect.chat (§1, §8)
8. ✅ Team pages — `/new-team-member/*` removed; all bios inline on `/our-team/` (§4.3)
9. ✅ Colors, fonts, theme (§6)
10. ✅ Blog — none (only theme demo posts; §3)

### Open questions for the clinic (content conflicts found on the live site)
- FAQ says "no fee for missed appointments" while cancellation fees of $50/$125 are listed elsewhere.
- Duplicate uninsured-service fees with different amounts (§4.5 note).
- Physiotherapy & Mental Health are advertised as services but the physiotherapist/psychologist bios were removed.
- Testimonial names and gallery images (AI-generated) — replace with real content?
- Footer typo "Sevices" and misc. spelling ("Tetnus", "Kanada", "creasent") — fix on rebuild.
- Which social handles are current (crescentmedical.ca vs crescentmedcentre)?

## 11. SEO notes

- Title pattern: `<Page> – Crescent Medicals`.
- Keep URL slugs identical on rebuild (or 301-redirect): `/about-us/`, `/our-team/`, `/medical-services/`, `/uninsured-services/`, `/faq/`, `/contact-us/`, `/view-clinic/`.
- `/new-team-member/*` already 404 on the live site — no redirects needed.
- 301 or `noindex` the ~30 theme-demo URLs (§3) on rebuild; they currently dilute the site's index.
- `robots.txt`: standard WP rules + sitemap pointer; disallows `/wp-content/uploads/wpforms/`.

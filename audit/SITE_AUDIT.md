# Crescent Medical Centre — Website Content Audit

**Site:** https://crescentmedical.ca/
**Audit date:** 2026-07-12
**Purpose:** Capture all pages and content of the existing (old) website so a new website can be rebuilt from scratch with matching data. No code has been written yet — this is the content-gathering phase.

---

## ⚠️ How this audit was collected (important)

Direct fetching of the website was **blocked in this session**:

- The sandbox network policy denies outbound connections to `crescentmedical.ca` (and almost all external domains), for both `curl` and the WebFetch tool.
- The site itself also returns `403 Forbidden` to automated fetchers (bot protection, likely Cloudflare/Wordfence).
- `web.archive.org` is also blocked by the sandbox policy.

All content below was therefore recovered via **search-engine indexing of the site** (search snippets of every indexed page) plus third-party directory listings. This recovers the site structure, all copy themes, team bios, FAQ answers, and contact data — but **not pixel-perfect verbatim copy, images, or exact price tables**. Items that still need direct verification are listed in [§9 Gaps](#9-gaps--items-needing-direct-verification).

**To close the gaps:** enable broader network access for this Claude Code environment (Environment settings → Network access → allow all domains, or at least `crescentmedical.ca` and `web.archive.org`), then a full page-by-page crawl (including images and exact wording) can be completed.

### Re-crawl attempt — 2026-07-12 (second session): still blocked

A dedicated crawl session re-attempted direct capture and confirmed the block is **entirely the sandbox egress policy**, not the site's bot protection — requests never leave the environment:

| Method | Result |
|---|---|
| `curl` with real Chrome User-Agent, via agent proxy | Proxy gateway answered **`403 Forbidden` to the CONNECT request itself** ("policy denial") — the TLS tunnel to `crescentmedical.ca:443` was never established, so no HTTP request reached the site. |
| WebFetch tool | `403 Forbidden` for `crescentmedical.ca`, and also for `archive.org`, `web.archive.org`, and even `wikipedia.org` — blanket denial of all non-allowlisted hosts. |
| Playwright + Chromium (`/opt/pw-browsers`) via the proxy | `net::ERR_TUNNEL_CONNECTION_FAILED` for both `https://crescentmedical.ca/` and the Wayback Machine snapshot URL. |
| Wayback Machine fallback | Blocked by the same policy (`archive.org` / `web.archive.org` CONNECT denied). |

Only allowlisted hosts (GitHub, npm/PyPI registries, anthropic.com) are reachable. The proxy's own guidance (`/root/.ccr/README.md`) states 403 CONNECT denials are organization egress policy and must not be worked around. **No verbatim page content, images, price table, or hours could be captured in this session; every item in §9 remains open.** Web search (the only working external channel) was re-checked for the price table and contact-page hours and still returns only the same non-authoritative third-party snippets already reflected in this document.

---

## 1. Site identity & platform

| Item | Value |
|---|---|
| Business name | Crescent Medical Centre (site title shows "Crescent Medicals") |
| Type | Family practice / walk-in medical clinic |
| Location | 923 37 Street SW, Calgary, AB T3C 1S4 (SW Calgary, 37th Street just south of Bow Trail, near Westbrook Mall and Westbrook LRT station) |
| Platform | WordPress (evident from URL patterns: `/new-team-member/` custom post type, leftover theme demo pages `home-page`, `about-extended`, `our-team-2`, `pricing-simple`, `view-clinic`, `services`; title separator "–"; page titles like "Home Page – Crescent Medicals") |
| Tagline / hero | "Your well-being is our priority." |
| Copyright (footer) | "Crescent Medicals © All rights reserved" |
| Extra feature | 24/7 interactive chatbot for scheduling appointments, service inquiries, general information |
| Online booking | Via Cortico: https://cortico.health/clinics/calgary-ab/crescent-medical-centre-32830/ |
| Facebook | https://www.facebook.com/crescentmedcentre/ |
| A former demo/staging site | `demo.crescentmedical.ca` (DNS no longer resolves; still appears in search indexes) |

## 2. Contact information

| Item | Value |
|---|---|
| Address | 923 37 Street SW, Calgary, AB T3C 1S4 |
| Phone | 587-318-1608 |
| Toll-free | (877) 419-1619 |
| Email | emailtocrescent@gmail.com |
| Walk-in hours | Walk-in patients accepted 9am–3pm daily (wait time can be 45–60 min) |
| Clinic hours (third-party listings — **conflicting, verify on site**) | Medimap: Mon–Thu 9:00–18:00, Fri 9:00–17:00, Sat 10:00–14:45, Sun closed. Another listing: Mon–Fri 8:30–18:00, Sat 10:00–15:00. |
| Accessibility | Wheelchair accessible; accepts private insurance and credit card payments |

## 3. Page inventory (discovered URLs)

### Primary/live pages
| # | URL | Page title (from index) | Status |
|---|---|---|---|
| 1 | `/` | Crescent Medicals (Home) | Live, content captured |
| 2 | `/about-us/` | About Us – Crescent Medicals | Live, content captured |
| 3 | `/our-team/` | Meet Our Dedicated Team at Crescent Medical Center | Live, content captured |
| 4 | `/medical-services/` | Medical Services – Crescent Medicals | Live, partially captured |
| 5 | `/uninsured-services/` | Uninsured Services – Crescent Medicals | Live, partially captured (price table missing) |
| 6 | `/faq/` | FAQ – Crescent Medicals | Live, content captured |
| 7 | `/contact-us/` | Contact Us – Crescent Medicals | Live, content captured |
| 8 | `/new-team-member/christine-kang/` | Dr Christine Y. Kang | Live, content captured |
| 9 | `/new-team-member/yaara-eilon-avigdor/` | Yaara Eilon-Avigdor | Live, content captured |

### Secondary / likely theme-leftover pages (indexed, decide whether to rebuild)
| # | URL | Page title | Notes |
|---|---|---|---|
| 10 | `/home-page/` | Home Page – Crescent Medicals | Duplicate/alternate home layout |
| 11 | `/about-extended/` | About us (Extended) | Extended about page — contains mission/vision/values copy |
| 12 | `/our-team-2/` | Our Team – Family doctor, medical care | Older/alternate team page (SEO title: "Family doctor, medical care – Crescent Medical Centre – Calgary, Alberta") |
| 13 | `/services/` | Services – Crescent Medicals | Generic services page (theme template) |
| 14 | `/pricing-simple/` | Pricing – Crescent Medicals | Tiered pricing table with labels "Lowest price", "Recommended", "Most popular" — appears to be theme demo content |
| 15 | `/view-clinic/` | View Clinic | Clinic gallery page (theme template) |

There may be additional `/new-team-member/<slug>/` pages for the other physicians (e.g. Dr. Oluwafunso) that are not indexed — verify during direct crawl.

## 4. Per-page content

### 4.1 Home (`/`)
- Hero: **"Your well-being is our priority."**
- Value-proposition sections:
  - "Personalized, affordable care with a focus on your well-being."
  - "Excellence in healthcare, backed by community trust and patient satisfaction."
  - "Trust our experienced team for comprehensive care deeply rooted in the community."
  - "Easy, timely care with walk-in options and a central location."
- Services intro: "Crescent Medical offers a wide array of comprehensive medical care services tailored to your needs, ranging from routine check-ups to specialized treatments. Diverse options ensure personalized care and support for every aspect of your health journey."
- Location blurb: "Crescent Medical Centre is a family practice clinic in the southwest of Calgary, conveniently situated on 37th Street, just south of Bow Trail and in close proximity to the Westbrook Mall. The Westbrook LRT station is easily reachable, making access to the clinic even more convenient."
- Walk-in messaging: doctors welcome walk-in patients daily; appointments take precedence to ensure timely care; same-day appointments offered if available.
- 24/7 chatbot mention.
- Contact block (address, phone, toll-free, email).

### 4.2 About Us (`/about-us/`) and About Extended (`/about-extended/`)
- Clinic description (same SW Calgary / 37th Street / Bow Trail / Westbrook Mall / Westbrook LRT copy).
- **Mission:** "To empower patients with knowledge and choices, fostering active participation in their healthcare journey."
- **Core values:**
  1. *Accessible and Compassionate Service* — dedicated to delivering accessible, compassionate, and patient-centered healthcare.
  2. *Excellence in Health and Wellness* — commitment extends to earning community trust through dedication to your health and safety.
  3. *Vision* — "a future where healthcare is accessible, inclusive, and personalized, empowering individuals to lead healthier lives through innovative medical solutions and compassionate care."
- Walk-ins welcomed daily.

### 4.3 Our Team (`/our-team/`, plus `/our-team-2/` legacy)

**Family physicians:**

1. **Dr. Saumya Selvaraj** — MD CCFP. From Saskatoon, Saskatchewan; received her medical degree in her hometown, then completed family medicine residency through the University of Calgary. Prioritizes collaborative patient care. Special interests: preventive health, women's and youth health, nutrition/weight management. Trained in Botox administration for migraine headaches, hyperhidrosis, and cosmetics.
2. **Dr. Constantinescu** — MD CCFP COE. Calgary native; Bachelor's in Biomedical Sciences and Medical Degree from the University of Calgary. Specializes in Family Medicine including obstetrics, gynecology, pediatrics, adolescent and adult medicine. Dedicated to Care of the Elderly/Geriatric medicine — enhancing dementia care and long-term facilities; also involved in long-term care and wound care.
3. **Dr. Saad Yasin** — MBBS CCFP MRCGP. Clinical Assistant Professor at the University of Calgary's Cumming School of Medicine. Graduated Jinnah Sindh Medical University, Karachi, Pakistan (1998); completed General Practice training in the UK (2005); moved to Calgary in 2012. Holds diplomas in obstetrics and gynaecology, sexual and reproductive health, occupational medicine, and medical acupuncture. Interests: child and adolescent health, women's health, mental health.
4. **Dr. Andrew** — MBCHB, MRCGP. Trained and practiced in the UK. Experienced in urgent and primary care; specializes in hospital care including obstetrics, gynecology, psychiatry, and pediatrics. Has delivered compassionate palliative and end-of-life care, supported patients and families with tailored treatment plans, managed chronic conditions, and collaborated with multidisciplinary teams.
5. **Dr. Ansari** — MBBS (Pune University, India). Highly skilled Family Physician with expertise in Family Medicine, Emergency Medicine, Obstetrics and Gynaecology, Mental Health, Geriatric & Palliative Care, and Minor Surgical Procedures, with experience across Canada, India, and the Middle East.
6. **Dr. Amira (Imdadullah)** — MD MCFP. (Site copy contains two versions — verify:) received medical degree from India with a postgraduate diploma from Dublin; practiced in India and the Middle East before migrating to Canada; for the past 4 years worked at Charles Curtis Hospital in Newfoundland and Labrador as ER and family physician. Experience in family medicine, emergency medicine, obstetrics & gynaecology, mental health counseling, and geriatric care. Multilingual: English, Hindi, Urdu, Kannada, Tamil, Arabic.
7. **Dr. Christine Y. Kang** — Female family physician. Medical degree from University of British Columbia; residency in Family Medicine at University of Calgary. Accepting new patients. (Has own page: `/new-team-member/christine-kang/`.)
8. **Dr. Oluwafunso** — Started full-time at Crescent Medical Centre from the 1st week of March 2025; open to accepting new patients and walk-ins.

**Allied health:**

9. **Maria — Primary Care Registered Psychologist (PCRP).** Works with a wide variety of mental health concerns; pivotal role in the clinic's comprehensive care model; supports patients in maintaining psychological well-being, moving through difficult life transitions and making good decisions around their well-being. Specialties/interests: Abuse (both victim and perpetrator), Anger Management, Anxiety, Bereavement/grief, Depression, Emotional regulation, Interpersonal skills, LGBQ2S+ concerns, Life transitions and personal growth, Mindfulness and meditation, Pain management, Relationship issues, Self-esteem, Sleep issues, Stress management, Trauma/PTSD.
10. **Yaara Eilon-Avigdor — Physiotherapist.** Graduate of Tel-Aviv University (2000); Clinical Masters in Manual Therapy from The University of Western Ontario (2010). Over 15 years of experience. Currently accepting new patients — call 587-318-1608 to book a "Meet & Greet" appointment. (Has own page: `/new-team-member/yaara-eilon-avigdor/`.)

### 4.4 Medical Services (`/medical-services/`)
Captured service themes (exact card list needs direct crawl):
- Routine check-ups / regular check-ins for ongoing health maintenance
- **Chronic disease education and management:** Hypertension, Heart disease, Diabetes, Obesity, Asthma, COPD and more; blood pressure monitoring, weight management, smoking cessation, insulin management
- Preventive health care
- Women's health (obstetrics, gynecology), prenatal
- Pediatric / child & adolescent health
- Mental health
- Geriatric / care of the elderly, palliative care
- Minor surgical procedures
- Botox administration (migraines, hyperhidrosis, cosmetics)
- Physiotherapy (Yaara)
- Psychology services (Maria, PCRP)
- **Eye disease screening (Euclid Telehealth partnership):** specialized eye disease screening covered by Alberta Health Care, for early detection, prevention and treatment of vision loss; non-invasive 20-minute screening at the clinic, one day per month

### 4.5 Uninsured Services (`/uninsured-services/`)
- Intro copy: "While the Alberta Health Care Plan covers many services patients receive from their doctors, several services are not covered by the government plan." Some are billed to lawyers, government agencies, or directly to the patient. The page provides a list of uninsured services billed to the patient with approximate costs for guidance.
- Disability forms assistance for insurance purposes (e.g., AISH, disability tax credit, MVA insurance forms, parking placard handicap forms, etc.). In-person appointment necessary; costs for forms/documents vary and must be paid before departure; call for pricing details.
- **The actual fee/price table was not indexed — must be captured by direct crawl.**

### 4.6 FAQ (`/faq/`)
Recovered Q&A content:
- **Prescription refills:** cannot be refilled via phone or fax. To refill, visit the walk-in clinic after scheduling an appointment; in-person consult required for accurate prescriptions and dosages.
- **Booking appointments:** call 587-318-1608 or email emailtocrescent@gmail.com; same-day appointments available; book online if you prefer a specific doctor.
- **Walk-ins:** welcomed daily, 9am–3pm; wait can be 45–60 minutes; calling ahead is recommended; appointments take precedence.
- **Wait times:** vary by caseload; clinic strives to keep them minimal; book ahead or call to expedite.
- **New patients:** family doctors are currently NOT accepting new patients, but walk-ins are warmly welcomed. (Note: individual pages say Dr. Kang / Dr. Oluwafunso / Yaara accept new patients — verify current state.)
- **Test/lab results:** per the Health Information Act, results must be reviewed in person; cannot be disclosed over the phone; for non-urgent results requiring discussion, the clinic contacts you to arrange an appointment.
- **Cancellations:** 24 hours' notice requested; a fee is charged for last-minute cancellations.
- **Euclid Telehealth eye screening:** one day per month, 20-minute non-invasive screening covered by Alberta Health Care.

### 4.7 Contact Us (`/contact-us/`)
- Address, phone, toll-free, email (see §2).
- Location/directions copy (37th Street, Bow Trail, Westbrook Mall, Westbrook LRT).
- Contact form (fields to verify by direct crawl).
- Google map embed (likely — verify).
- Hours table (verify exact values — third-party sources conflict).

### 4.8 Theme-leftover pages (`/home-page/`, `/services/`, `/pricing-simple/`, `/view-clinic/`, `/our-team-2/`, `/about-extended/`)
- `/pricing-simple/`: tiered pricing cards labelled "Lowest price", "Recommended", "Most popular" — looks like demo content, probably should NOT be rebuilt.
- `/view-clinic/`: clinic gallery page.
- `/our-team-2/`: alternate team page with older SEO title "Our Team – Family doctor, medical care – Crescent Medical Centre – Calgary, Alberta".
- Recommendation: rebuild only pages 1–9; drop or redirect the leftovers.

## 5. Navigation structure (inferred — verify)
Header nav (probable): Home · About Us · Our Team · Medical Services · Uninsured Services · FAQ · Contact Us
Footer: contact block + "Crescent Medicals © All rights reserved".

## 6. SEO notes
- Title pattern: `<Page> – Crescent Medicals` (some older pages: `<Page> - Family doctor, medical care - Crescent Medical Centre - Calgary, Alberta`).
- Keep URL slugs identical on rebuild (or 301-redirect) to preserve rankings: `/about-us/`, `/our-team/`, `/medical-services/`, `/uninsured-services/`, `/faq/`, `/contact-us/`, `/new-team-member/<slug>/`.

## 7. Integrations / functionality to reproduce
1. 24/7 chatbot (appointments, service inquiries, general info)
2. Online booking (Cortico) — link out
3. Contact form → email
4. Google Maps embed
5. FAQ accordion
6. Team profile pages (custom post type equivalent)

## 8. Third-party presence (reference data, not site content)
- Cortico booking: https://cortico.health/clinics/calgary-ab/crescent-medical-centre-32830/
- Facebook: https://www.facebook.com/crescentmedcentre/
- Medimap, YellowPages, RateMDs, familydoctorcalgary.com listings exist
- Rating ~3.8★ (115 reviews per one aggregator)

## 9. Gaps — items needing direct verification

These could not be recovered from search indexes and require a direct crawl. **Status as of the 2026-07-12 re-crawl attempt: all 10 items remain unresolved** — the sandbox egress policy still blocks `crescentmedical.ca` and `web.archive.org` for every fetch method (curl, WebFetch, Playwright/Chromium; see "Re-crawl attempt" note above):

1. **Uninsured services price table** — exact items and dollar amounts.
2. **Exact clinic hours table** on contact page (third-party listings conflict: Mon–Fri 9–6/Fri to 5 vs 8:30–6; Sat 10–14:45 vs 10–15; Sun closed vs open).
3. **All images** — logo, hero images, team photos, clinic gallery, favicons.
4. **Exact verbatim copy** of every section (current capture is high-fidelity but snippet-based).
5. **Contact form fields** and form handler.
6. **Header/footer nav order**, any top bar (phone/hours strip), social icons.
7. **Chatbot vendor/embed code.**
8. **Other `/new-team-member/` pages** not indexed (e.g., Dr. Oluwafunso, Maria, Dr. Amira, etc.).
9. **Colors, fonts, theme name** — visual design tokens.
10. Whether any blog/news posts exist (none indexed).

**How to unblock:** In the Claude Code environment settings for this repository, set Network access to "All domains" (or add `crescentmedical.ca` + `web.archive.org` to the allowlist), then re-run the crawl to capture verbatim HTML, images, and the price table before starting the rebuild.

# Business Context — Nasrin Mashayekhi Portfolio

This document captures the business and personal context behind the website so that anyone working on the codebase (or an AI assistant) understands the purpose, audience, and constraints without needing to ask.

---

## The Artist

**Name:** Nasrin Mashayekhi (نسرین مشایخی)  
**Born:** Tehran, Iran — 1984 (1363 Solar Hijri)  
**Occupation:** Watercolor artist and instructor  
**Medium:** Watercolor painting  

**Education:**
- Bachelor of Art (Illustration) — University of Karaj, 2012
- Master of Art (Visual Communications) — University of Tehran, 2017

**Selected exhibitions:**
- 2021 — Group Painting Exhibition, Davoodi Gallery, Tehran
- 2021 — Group Visual Art Exhibition, Entezami Gallery, Tehran
- 2022 — 2nd Watercolorist Exhibition, Saba Art Gallery, Tehran

**Artistic philosophy:** "Art is longing. You never arrive, but you keep going in the hope that you will." — Anselm Kiefer  
Nasrin's goal is to teach not just techniques but to help students build creative confidence and find joy in the watercolor medium.

---

## Purpose of the Website

The site serves two primary functions:

1. **Online portfolio** — Showcase watercolor artworks organized by category (landscapes, street scenes, florals, animals, etc.) for potential buyers, galleries, and collaborators.

2. **Course catalog** — Advertise structured watercolor courses (beginner to advanced) and enable prospective students to contact Nasrin to enroll.

The primary conversion action is **contact** — the site does not have e-commerce or online payment. Students contact Nasrin directly via phone, email, or WhatsApp to discuss course details and enrollment.

---

## Audience

- **Primary:** Persian/Farsi-speaking audience in Iran and the Iranian diaspora  
- **Secondary:** English-speaking art enthusiasts and international visitors  
- The site is fully bilingual (EN ↔ FA) with automatic language detection and RTL layout for Persian

---

## Contact Information

Managed via `public/contact.json`. Current values:

| Field | Value |
|---|---|
| Email | radiingh@gmail.com |
| Phone | +989125050989 |
| WhatsApp | +989125050989 |

**To update:** edit `public/contact.json` only. No code changes needed.

---

## Current Courses

| Slug | Title (EN) | Title (FA) | Duration | Price | Level |
|---|---|---|---|---|---|
| `watercolor-basics` | Watercolor Basics | مبانی آبرنگ | 18h | 180,000T | Beginner Friendly |
| `advanced-watercolor` | Advanced Watercolor Techniques | تکنیک‌های پیشرفته آبرنگ | 24h | 240,000T | Intermediate+ |

Prices are in Iranian Toman (T). The site does not handle payment — contact only.

---

## Gallery Categories

| Slug | EN Name | FA Name | Image count |
|---|---|---|---|
| `animals` | Animals | حیوانات | 3 |
| `flowers` | Flowers | گل‌ها | 6 |
| `landscapes` | Landscapes | طبیعت | 18 |
| `pen-and-ink` | Pen and Ink | قلم و جوهر | 5 |
| `still-life` | Still Life | طبیعت بی‌جان | 4 |
| `street-scenes` | Street Scenes | صحنه‌های خیابانی | 30 |

Total: 66 artworks. None currently have per-artwork metadata (titles/descriptions) — that is supported by the system and can be added later by dropping `metadata.json` files into artwork folders.

---

## Technical Owner

**Developer:** Radin (radiingh@gmail.com)  
**Repo:** `nasrin-mashayekhi` on GitHub  
**Live URL:** `https://[github-username].github.io/nasrin-mashayekhi/`  
**Deployment:** GitHub Pages via `npm run deploy`

---

## Key Business Rules

1. **No hardcoded contact details in code.** All contact info lives in `public/contact.json`. If Nasrin changes her phone number, only that file changes.

2. **No online payments.** The enroll button opens a pre-filled email to Nasrin. Enrollment is handled offline.

3. **Bilingual parity.** Every visible piece of text must exist in both `en/translation.json` and `fa/translation.json`. Never add English-only content.

4. **Image addition = no-code change.** Adding new artworks or categories requires only dropping files in `public/art-gallery/` and running `npm run generate-manifests`. No JSX changes.

5. **Course addition = no-code change.** Same pattern — drop files in `public/courses/` and regenerate.

6. **RTL-safe layout.** All new UI must use `inset-inline-start/end` (not `left/right`), `margin-inline-start/end`, etc. Test every new component in Persian/RTL mode before shipping.

---

## Future Enhancements (not yet built)

- Per-artwork titles and descriptions (infrastructure exists; just add `metadata.json` files)
- Thumbnail images for faster gallery grid loading (infrastructure exists; add `thumbnail.jpg` files)
- Image purchase / print-on-demand integration
- Online booking / scheduling for courses
- Student testimonials section

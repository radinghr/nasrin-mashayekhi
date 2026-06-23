# CLAUDE.md — Nasrin Mashayekhi Portfolio

## 1. Before You Start

**Think before coding.** Surface assumptions and tradeoffs upfront. If a request has two reasonable interpretations, present them — don't silently pick one. If a task requires touching 5+ files, confirm the plan first.

**Simplicity first.** No features beyond what was asked. No abstractions for single-use code. Three similar lines is better than a premature helper.

**Surgical changes.** Touch only what the task requires. Match existing code patterns even if you'd prefer different conventions. Don't clean up surroundings unless asked.

---

## 2. Project at a Glance

React 19 + Vite 8 portfolio for watercolor artist **Nasrin Mashayekhi**. Bilingual EN/FA (Persian RTL). Dark/light theme via CSS custom properties. Deployed to GitHub Pages at `/nasrin-mashayekhi/`.

- **Stack:** React 19, Vite 8, React Router v7, i18next (EN/FA)
- **Deploy:** `npm run deploy` (gh-pages)

---

## 3. Where to Look for What

Use this table before reaching for Glob or Grep. Read only the file you need.

| Concern | File to read |
|---|---|
| All CSS tokens (colors, radius, spacing, shadows, fonts) | `src/styles/variables.css` |
| Global resets and layout scaffolding | `src/styles/global.css` |
| Hero photo, bio, exhibitions | `src/pages/Home.jsx` + `src/pages/Home.css` |
| Gallery masonry, filter, lightbox trigger | `src/pages/Gallery.jsx` + `src/pages/Gallery.css` |
| Course cards, enroll flow | `src/pages/Courses.jsx` + `src/pages/Courses.css` |
| Contact email / phone / WhatsApp values | `public/contact.json` (single source of truth) |
| Contact data in components | `src/context/ContactContext.jsx` → `useContact()` hook |
| Navigation links, mobile hamburger | `src/components/Navbar.jsx` |
| Bilingual logo | `src/components/Logo.jsx` |
| Email/phone/WhatsApp modal (portal) | `src/components/ContactModal.jsx` |
| Full-screen image viewer (portal) | `src/components/Lightbox.jsx` |
| Gallery artwork data shape | `public/art-gallery-manifest.json` (auto-generated) |
| Course data shape | `public/courses-manifest.json` (auto-generated) |
| Manifest generation script | `scripts/generate-manifests.js` |
| i18n strings | `src/locales/en/` and `src/locales/fa/` |
| Route definitions | `src/App.jsx` |
| Vite config / base URL | `vite.config.js` |
| Business context / artist background | `BUSINESS_CONTEXT.md` |

**Do not read** `node_modules/`, `dist/`, `public/art-gallery/` image files, or `package-lock.json` unless explicitly asked.

---

## 4. Architecture Rules (Do Not Break)

### RTL / Bilingual
- Use `inset-inline-start/end` instead of `left/right` in CSS.
- Use `margin-inline-start/end` instead of `margin-left/right`.
- Persian text uses `font-family: var(--fa)` (Vazirmatn). Always add a `[dir="rtl"]` override when setting `font-family`.
- i18n key lookups via `useTranslation()` hook — never hardcode user-visible strings.

### Asset paths
- Always use `import.meta.env.BASE_URL` when constructing paths to `public/` assets — the site is served from a subdirectory (`/nasrin-mashayekhi/`), so bare `/image.png` paths will 404 in production.

### Contact data
- **Never hardcode** email, phone, or WhatsApp numbers anywhere in JSX or CSS.
- Consume via `useContact()` from `ContactContext` or fetch `public/contact.json` directly.

### Portals
- `ContactModal` and `Lightbox` **must** use `ReactDOM.createPortal(jsx, document.body)`.
- The page transition animation uses `transform: translateY()`, which creates a stacking context that breaks `position: fixed` for any descendant — portals escape this.

### Manifests
- `public/art-gallery-manifest.json` and `public/courses-manifest.json` are **generated**, not hand-edited.
- Run `npm run generate-manifests` (or `node scripts/generate-manifests.js`) after adding/removing artwork or courses.
- Manifest shape: `{ categories: [{ slug, metadataFile, artworks: [{ slug, hasThumbnail, hasMetadata }] }] }` for gallery; `{ courses: [] }` for courses.

---

## 5. CSS System

All design tokens live in `src/styles/variables.css` inside `:root`. Dark theme overrides are in `[data-theme="dark"]`. **No CSS-in-JS.**

Key token groups:
```
Colors:   --paper, --ink, --sienna, --sage  (+ -soft, -faint, -deep variants)
Fonts:    --serif (Playfair Display), --sans (DM Sans), --fa (Vazirmatn)
Spacing:  --space-1 (4px) … --space-10 (128px)
Radius:   --radius-sm/md/lg/xl  +  --radius-img (shared for all artwork images)
Shadows:  --shadow-rest, --shadow-lift, --shadow-modal
Motion:   --ease (cubic-bezier), --fade (620ms)
```

**To change image border-radius site-wide:** edit only `--radius-img` in `variables.css`.

---

## 6. Content Structure

### Gallery
```
public/art-gallery/
  [category-slug]/          # e.g. animals, flowers, landscapes
    metadata.json           # { "name": "Animals", "nameFa": "حیوانات" }
    [artwork-slug]/
      image.jpg             # required
      thumbnail.jpg         # optional
      metadata.json         # optional: title, titleFa, year, medium, dimensions
```
Current categories: `animals`, `flowers`, `landscapes`, `pen-and-ink`, `still-life`, `street-scenes` (66 images).

### Courses
```
public/courses/
  [course-slug]/
    course-info.json        # EN + FA keys for title, lede, rows, price, duration
```
Current courses: `watercolor-basics`, `advanced-watercolor`.

---

## 7. Commands

```bash
npm run dev                  # local dev server
npm run build                # production build (runs generate-manifests first)
npm run generate-manifests   # regenerate both manifest files
npm run deploy               # build + push to gh-pages
```

---

## 8. Windows Platform Notes

- **Case-sensitive renames:** Windows filesystem is case-insensitive. When renaming a directory where old and new names differ only by case (e.g. `Animals` → `animals`), always copy to a `__tmp__` dir first, delete the original, then rename. Skipping this step caused data loss during the gallery migration (recovered from git). See `scripts/migrate-gallery.js` for the reference pattern.
- Shell: PowerShell primary, Git Bash also available. Use Bash for POSIX scripts; PowerShell for Windows-native operations.
- Never use `/tmp` — use the session scratchpad or `os.tmpdir()` in Node scripts.

---

## 9. Token Optimization Rules

1. **Read from the table in §3** before running Glob or Grep. Most tasks touch one or two files.
2. **Read only the relevant section** of a file if it is long (use `offset`/`limit` on the Read tool).
3. **Don't re-read files you just edited** — the edit tool confirms success; the state is known.
4. **Don't scan `public/art-gallery/`** for image files — use the manifest instead.
5. **Skip `git log` / `git diff`** unless the task is about history or commits.
6. **Ask one clarifying question** when genuinely ambiguous, then act — don't list options and wait for multiple rounds of approval.

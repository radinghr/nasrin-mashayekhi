# Nasrin Mashayekhi — Watercolor Artist Website

A production-ready, multilingual (English + Persian/RTL) portfolio website built with React, Vite, and i18next. Deployed to GitHub Pages.

---

## Running Locally

```bash
# Install dependencies
npm install

# Generate manifest files (needed before first dev run)
npm run generate-manifests

# Start the dev server
npm run dev
```

The site will be available at `http://localhost:5173/nasrin-mashayekhi/`.

---

## Adding Gallery Images

1. Drop your images (`.jpg`, `.jpeg`, `.png`, `.webp`) into the correct category folder under `public/art-gallery/`:
   ```
   public/art-gallery/florals/my-flower.jpg
   public/art-gallery/landscapes/sunset.jpg
   ```
2. To create a new category, create a new folder:
   ```
   public/art-gallery/still-life/
   ```
3. Regenerate the manifest:
   ```bash
   npm run generate-manifests
   ```
4. The gallery will pick up the changes automatically on next page load.

---

## Adding a New Course

1. Create a new folder under `public/courses/` using a slug as the name:
   ```
   public/courses/portrait-watercolor/
   ```
2. Add a course image as `course-image.jpg` inside that folder.
3. Add a `course-info.json` with this structure:
   ```json
   {
     "en": {
       "course_title": "Portrait Watercolor",
       "course_information": "Description in English…",
       "duration": "20h",
       "price": "200,000T",
       "level": "Intermediate"
     },
     "fa": {
       "course_title": "آبرنگ پرتره",
       "course_information": "توضیحات به فارسی…",
       "duration": "۲۰ ساعت",
       "price": "۲۰۰،۰۰۰ تومان",
       "level": "متوسط"
     }
   }
   ```
4. Regenerate the manifest:
   ```bash
   npm run generate-manifests
   ```

---

## Adding a New Language

1. Create a translation file: `src/locales/[lang]/translation.json`
   — copy `src/locales/en/translation.json` as a starting point and translate all values.

2. Open `src/i18n.js` and add:
   ```js
   import de from './locales/de/translation.json'
   // ...inside resources:
   de: { translation: de },
   // ...inside supportedLngs:
   'de',
   ```

3. Open `src/components/LanguageToggle.jsx` and add the language to `LANGUAGES`:
   ```js
   de: { dir: 'ltr', label: 'DE' },
   ```

4. Update the toggle logic in `LanguageToggle.jsx` if you want a cycle through more than two languages.

---

## Deploying to GitHub Pages

Make sure `vite.config.js` has the correct `base` matching your repository name:
```js
base: '/nasrin-mashayekhi/',
```

Then run:
```bash
npm run deploy
```

This will:
1. Regenerate manifests
2. Build the production bundle (`dist/`)
3. Push the `dist/` folder to the `gh-pages` branch

GitHub Pages will serve the site from that branch. Enable it in **Settings → Pages → Source → gh-pages branch**.

---

## Project Structure

```
/public
  /art-gallery/[category]/      ← place images here
  /courses/[course-name]/       ← place course-image.jpg + course-info.json here
  art-gallery-manifest.json     ← auto-generated
  courses-manifest.json         ← auto-generated

/scripts
  generate-manifests.js         ← scans public/ and writes manifests

/src
  /components                   ← Navbar, Footer, Logo, ThemeToggle, LanguageToggle, Lightbox
  /pages                        ← Home, Gallery, Courses
  /locales/en|fa                ← translation files
  /hooks                        ← useManifest.js
  /styles                       ← global.css, variables.css
  i18n.js                       ← i18next configuration
  App.jsx                       ← router, theme state, lang/dir sync
  main.jsx                      ← React root, BrowserRouter
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + Vite | UI and build tooling |
| React Router v7 | Client-side routing |
| i18next + react-i18next | EN / FA multilingual support |
| CSS Variables | Dark / light theming — no CSS-in-JS |
| gh-pages | GitHub Pages deployment |

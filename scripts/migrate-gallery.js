#!/usr/bin/env node
/**
 * One-time migration: moves existing flat gallery images into the new
 * [category-slug]/[artwork-slug]/image.jpg structure.
 * Also creates per-category metadata.json files.
 * Windows-safe: handles case-insensitive filesystem.
 * Run once: node scripts/migrate-gallery.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const galleryDir = path.resolve(__dirname, '../public/art-gallery')

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

const CATEGORY_MAP = [
  { old: 'Animals',      slug: 'animals',      en: 'Animals',      fa: 'حیوانات' },
  { old: 'Flowers',      slug: 'flowers',      en: 'Flowers',      fa: 'گل‌ها' },
  { old: 'Landscapes',   slug: 'landscapes',   en: 'Landscapes',   fa: 'طبیعت' },
  { old: 'Pen and Ink',  slug: 'pen-and-ink',  en: 'Pen and Ink',  fa: 'قلم و جوهر' },
  { old: 'Still life',   slug: 'still-life',   en: 'Still Life',   fa: 'طبیعت بی‌جان' },
  { old: 'Street Scenes',slug: 'street-scenes',en: 'Street Scenes',fa: 'صحنه‌های خیابانی' },
]

for (const cat of CATEGORY_MAP) {
  const oldPath = path.join(galleryDir, cat.old)

  if (!fs.existsSync(oldPath)) {
    console.log(`[skip] "${cat.old}" not found (maybe already migrated)`)
    continue
  }

  // Check if it has flat image files (not yet migrated)
  const oldEntries = fs.readdirSync(oldPath, { withFileTypes: true })
  const hasImages = oldEntries.some(
    (e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase())
  )
  if (!hasImages) {
    console.log(`[skip] "${cat.old}" has no flat images, skipping`)
    continue
  }

  // Collect image files before any directory changes
  const imageFiles = oldEntries
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)

  // On case-insensitive filesystems (Windows/macOS), old === slug may map to same dir.
  // Use a temp directory to avoid clobbering.
  const sameDir = cat.old.toLowerCase() === cat.slug.toLowerCase()
  const tempPath = sameDir ? path.join(galleryDir, `__tmp_${cat.slug}__`) : null

  // Step 1: Create temp dir or new slug dir
  const workPath = sameDir ? tempPath : path.join(galleryDir, cat.slug)
  fs.mkdirSync(workPath, { recursive: true })

  // Step 2: Write category metadata.json
  const meta = { en: { name: cat.en }, fa: { name: cat.fa } }
  fs.writeFileSync(path.join(workPath, 'metadata.json'), JSON.stringify(meta, null, 2))

  // Step 3: Copy images into artwork subdirs inside workPath
  for (const file of imageFiles) {
    const basename = path.basename(file, path.extname(file))
    const artworkSlug = basename.toLowerCase().replace(/\s+/g, '-')
    const artworkDir = path.join(workPath, artworkSlug)
    fs.mkdirSync(artworkDir, { recursive: true })
    fs.copyFileSync(path.join(oldPath, file), path.join(artworkDir, 'image.jpg'))
    console.log(`  [copy] ${cat.old}/${file} → ${cat.slug}/${artworkSlug}/image.jpg`)
  }

  // Step 4: Remove original flat files from old dir
  for (const file of imageFiles) {
    fs.unlinkSync(path.join(oldPath, file))
  }

  // Step 5: If we used a temp dir, now move it to the final slug name
  if (sameDir) {
    // Remove the now-empty old dir (or rename it)
    // On Windows, can't rename if dest already exists with different case
    // So: remove old dir, then rename temp to slug
    fs.rmdirSync(oldPath) // Should be empty now (flat images removed)
    fs.renameSync(tempPath, path.join(galleryDir, cat.slug))
  } else if (cat.old !== cat.slug) {
    // Different name entirely — remove old dir
    fs.rmSync(oldPath, { recursive: true, force: true })
  }

  console.log(`[done] "${cat.old}" → "${cat.slug}" (${imageFiles.length} images)`)
}

console.log('\n[migrate-gallery] Done.')

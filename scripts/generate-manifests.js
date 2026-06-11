#!/usr/bin/env node
/**
 * Scans public/art-gallery/ and public/courses/ to generate manifest JSON files
 * consumed by the React app at runtime.
 *
 * Run:  npm run generate-manifests
 * Also runs automatically before every build via the package.json "build" script.
 *
 * Gallery folder structure expected:
 *   public/art-gallery/
 *     [category-slug]/
 *       metadata.json          ← category-level metadata (always present)
 *       [artwork-slug]/
 *         image.jpg            ← full-resolution image (required)
 *         thumbnail.jpg        ← optional thumbnail
 *         metadata.json        ← optional per-artwork metadata
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

// ---------------------------------------------------------------------------
// Art Gallery Manifest
// ---------------------------------------------------------------------------
const galleryDir = path.join(publicDir, 'art-gallery')
const galleryManifestPath = path.join(publicDir, 'art-gallery-manifest.json')

const categories = []

if (fs.existsSync(galleryDir)) {
  const entries = fs.readdirSync(galleryDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const categorySlug = entry.name
    const categoryPath = path.join(galleryDir, categorySlug)

    // Scan artwork subdirectories
    const artworks = []
    const artworkEntries = fs.readdirSync(categoryPath, { withFileTypes: true })
    for (const artworkEntry of artworkEntries) {
      if (!artworkEntry.isDirectory()) continue
      const artworkSlug = artworkEntry.name
      const artworkPath = path.join(categoryPath, artworkSlug)

      const hasThumbnail = fs.existsSync(path.join(artworkPath, 'thumbnail.jpg'))
      const hasMetadata  = fs.existsSync(path.join(artworkPath, 'metadata.json'))

      artworks.push({ slug: artworkSlug, hasThumbnail, hasMetadata })
    }

    artworks.sort((a, b) => a.slug.localeCompare(b.slug))

    categories.push({
      slug: categorySlug,
      metadataFile: 'metadata.json',
      artworks,
    })
  }

  categories.sort((a, b) => a.slug.localeCompare(b.slug))
}

fs.writeFileSync(galleryManifestPath, JSON.stringify({ categories }, null, 2))
const totalArtworks = categories.reduce((n, c) => n + c.artworks.length, 0)
console.log(`[manifests] art-gallery-manifest.json — ${categories.length} category(ies), ${totalArtworks} artwork(s)`)

// ---------------------------------------------------------------------------
// Courses Manifest
// ---------------------------------------------------------------------------
const coursesDir = path.join(publicDir, 'courses')
const coursesManifestPath = path.join(publicDir, 'courses-manifest.json')

const courses = []

if (fs.existsSync(coursesDir)) {
  const entries = fs.readdirSync(coursesDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) courses.push(entry.name)
  }
  courses.sort()
}

fs.writeFileSync(coursesManifestPath, JSON.stringify({ courses }, null, 2))
console.log(`[manifests] courses-manifest.json — ${courses.length} course(s)`)

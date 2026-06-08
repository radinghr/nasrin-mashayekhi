#!/usr/bin/env node
/**
 * Scans public/art-gallery/ and public/courses/ to generate manifest JSON files
 * consumed by the React app at runtime.
 *
 * Run:  npm run generate-manifests
 * Also runs automatically before every build via the package.json "build" script.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

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
    const categoryPath = path.join(galleryDir, entry.name)
    const images = fs
      .readdirSync(categoryPath)
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
    categories.push({ name: entry.name, images })
  }
}

fs.writeFileSync(galleryManifestPath, JSON.stringify({ categories }, null, 2))
console.log(`[manifests] art-gallery-manifest.json — ${categories.length} category(ies)`)

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

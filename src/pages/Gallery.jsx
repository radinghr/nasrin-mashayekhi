import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useManifest } from '../hooks/useManifest'
import Lightbox from '../components/Lightbox'
import './Gallery.css'

const BASE = import.meta.env.BASE_URL
const MANIFEST_URL = `${BASE}art-gallery-manifest.json`
const IMAGES_PER_PAGE = 6

const toFaDigits = (n) =>
  String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])

const fmtSize = (w, h, lang) =>
  lang === 'fa'
    ? `${toFaDigits(w)} × ${toFaDigits(h)} سانتی‌متر`
    : `${w} × ${h} cm`

export default function Gallery() {
  const { t, i18n } = useTranslation()
  const { data, loading, error } = useManifest(MANIFEST_URL)
  const lang = i18n.language?.slice(0, 2) || 'en'
  const isRTL = i18n.dir() === 'rtl'

  const [activeCat, setActiveCat] = useState(null)
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE)
  const [lightbox, setLightbox] = useState(null)
  const [categoryMeta, setCategoryMeta] = useState({})
  const sentinelRef = useRef(null)

  const categories = data?.categories ?? []

  // Fetch category-level metadata.json for localized names
  useEffect(() => {
    if (!categories.length) return
    let cancelled = false
    categories.forEach((cat) => {
      if (categoryMeta[cat.slug]) return
      fetch(`${BASE}art-gallery/${cat.slug}/${cat.metadataFile}`)
        .then((r) => r.json())
        .then((json) => {
          if (!cancelled) setCategoryMeta((prev) => ({ ...prev, [cat.slug]: json }))
        })
        .catch(() => {
          if (!cancelled) setCategoryMeta((prev) => ({
            ...prev,
            [cat.slug]: { en: { name: cat.slug }, fa: { name: cat.slug } }
          }))
        })
    })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length])

  function getCategoryName(slug) {
    const meta = categoryMeta[slug]
    return meta?.[lang]?.name || meta?.en?.name || slug.replace(/-/g, ' ')
  }

  // Flat list of all artworks with categorySlug stamped on each
  const allArtworks = useMemo(() =>
    categories.flatMap((cat) =>
      cat.artworks.map((a) => ({ ...a, categorySlug: cat.slug }))
    ),
  [categories])

  // Active view (filtered or all)
  const activeArtworks = useMemo(() => {
    if (!activeCat) return allArtworks
    const cat = categories.find((c) => c.slug === activeCat)
    return (cat?.artworks ?? []).map((a) => ({ ...a, categorySlug: cat.slug }))
  }, [categories, activeCat, allArtworks])

  const visibleArtworks = activeArtworks.slice(0, visibleCount)
  const hasMore = visibleCount < activeArtworks.length

  function selectAll() { setActiveCat(null); setVisibleCount(IMAGES_PER_PAGE) }
  function selectCat(slug) { setActiveCat(slug); setVisibleCount(IMAGES_PER_PAGE) }

  // Infinite scroll: load more when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + IMAGES_PER_PAGE)
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore])

  if (loading) {
    return (
      <main className="page gallery-page">
        <div className="wrap gallery-loading">{t('gallery.loading')}</div>
      </main>
    )
  }
  if (error) {
    return (
      <main className="page gallery-page">
        <div className="wrap gallery-error">{error}</div>
      </main>
    )
  }

  return (
    <main className="page gallery-page page-fade" id="main-content">
      <div className="wrap">

        {/* Header */}
        <div className="gal-head">
          <div className="eyebrow">{t('gallery.eyebrow')}</div>
          <h1 className="display gal-head__title">{t('gallery.pageTitle')}</h1>
        </div>

        {/* Category filter — plain serif text labels, single active */}
        {categories.length > 1 && (
          <div className="cats" role="group" aria-label={t('gallery.filterLabel')}>
            <button
              className={`cat ${!activeCat ? 'is-active' : ''}`}
              onClick={selectAll}
              aria-pressed={!activeCat}
            >
              {t('gallery.all')}
              <sup className="n">{allArtworks.length}</sup>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`cat ${activeCat === cat.slug ? 'is-active' : ''}`}
                onClick={() => selectCat(cat.slug)}
                aria-pressed={activeCat === cat.slug}
              >
                {getCategoryName(cat.slug)}
                <sup className="n">{cat.artworks.length}</sup>
              </button>
            ))}
          </div>
        )}

        {/* Masonry grid */}
        {visibleArtworks.length === 0 ? (
          <p className="gallery-empty">{t('gallery.noImages')}</p>
        ) : (
          <>
            <div className="masonry">
              {visibleArtworks.map((artwork) => {
                const imgSrc = artwork.hasThumbnail
                  ? `${BASE}art-gallery/${artwork.categorySlug}/${artwork.slug}/thumbnail.jpg`
                  : `${BASE}art-gallery/${artwork.categorySlug}/${artwork.slug}/image.jpg`

                const slugTitle = artwork.slug.replace(/-/g, ' ')

                return (
                  <article
                    key={`${artwork.categorySlug}-${artwork.slug}`}
                    className="tile"
                    onClick={() => setLightbox({
                      categorySlug: artwork.categorySlug,
                      artworkSlug: artwork.slug,
                      artworks: activeArtworks,
                    })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setLightbox({
                          categorySlug: artwork.categorySlug,
                          artworkSlug: artwork.slug,
                          artworks: activeArtworks,
                        })
                      }
                    }}
                    aria-label={`View ${slugTitle}`}
                  >
                    <div className="tile__frame">
                      <img
                        className="tile__img"
                        loading="lazy"
                        src={imgSrc}
                        alt={slugTitle}
                      />
                    </div>
                    <div className="tile__cap">
                      <span className="tile__ti">{slugTitle}</span>
                      {artwork.hasMetadata && (
                        <TileMeta artwork={artwork} lang={lang} />
                      )}
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="gallery-sentinel" aria-hidden="true" />
            )}
          </>
        )}

      </div>

      {lightbox && (
        <Lightbox
          categorySlug={lightbox.categorySlug}
          artworkSlug={lightbox.artworkSlug}
          artworks={lightbox.artworks}
          lang={lang}
          isRTL={isRTL}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  )
}

/* Tile metadata line — only rendered when artwork.hasMetadata is true. */
function TileMeta({ artwork, lang }) {
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${BASE}art-gallery/${artwork.categorySlug}/${artwork.slug}/metadata.json`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setMeta(json) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [artwork.categorySlug, artwork.slug])

  if (!meta) return null

  const loc = meta[lang] ?? meta.en ?? {}
  const technique = loc.technique || null
  const year = loc.year || null
  const sizeW = loc.sizeW || null
  const sizeH = loc.sizeH || null

  const parts = [
    technique,
    sizeW && sizeH ? fmtSize(sizeW, sizeH, lang) : null,
    year ? (lang === 'fa' ? toFaDigits(year) : year) : null,
  ].filter(Boolean)

  if (!parts.length) return null

  return (
    <span className="tile__meta">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="tile__dot" aria-hidden="true">·</span>}
          {part}
        </span>
      ))}
    </span>
  )
}

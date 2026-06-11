import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useManifest } from '../hooks/useManifest'
import Lightbox from '../components/Lightbox'
import './Gallery.css'

const BASE = import.meta.env.BASE_URL
const MANIFEST_URL = `${BASE}art-gallery-manifest.json`
const IMAGES_PER_PAGE = 6

export default function Gallery() {
  const { t, i18n } = useTranslation()
  const { data, loading, error } = useManifest(MANIFEST_URL)
  const lang = i18n.language?.slice(0, 2) || 'en'
  const isRTL = i18n.dir() === 'rtl'

  const [activeCategories, setActiveCategories] = useState(null)
  const [pages, setPages] = useState({})
  const [lightbox, setLightbox] = useState(null)
  // categoryMeta: { [slug]: { en: { name }, fa: { name } } }
  const [categoryMeta, setCategoryMeta] = useState({})

  const categories = data?.categories ?? []

  // Fetch category metadata.json for each category
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
          if (!cancelled) setCategoryMeta((prev) => ({ ...prev, [cat.slug]: { en: { name: cat.slug }, fa: { name: cat.slug } } }))
        })
    })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length])

  const visibleCategories = useMemo(() => {
    if (!activeCategories || activeCategories.length === 0) return categories
    return categories.filter((c) => activeCategories.includes(c.slug))
  }, [categories, activeCategories])

  function getCategoryName(slug) {
    const meta = categoryMeta[slug]
    return meta?.[lang]?.name || meta?.en?.name || slug.replace(/-/g, ' ')
  }

  function toggleCategory(slug) {
    setActiveCategories((prev) => {
      if (!prev) return [slug]
      if (prev.includes(slug)) {
        const next = prev.filter((n) => n !== slug)
        return next.length === 0 ? null : next
      }
      return [...prev, slug]
    })
    setPages({})
  }

  function selectAll() {
    setActiveCategories(null)
    setPages({})
  }

  function getPage(slug) { return pages[slug] ?? 0 }
  function setPage(slug, page) { setPages((prev) => ({ ...prev, [slug]: page })) }

  if (loading) return <main className="page gallery-page"><div className="container gallery-loading">{t('gallery.loading')}</div></main>
  if (error)   return <main className="page gallery-page"><div className="container gallery-error">{error}</div></main>

  const allSelected = !activeCategories

  return (
    <main className="page gallery-page" id="main-content">
      <div className="container">
        <h1 className="gallery-title">{t('gallery.pageTitle')}</h1>

        {/* ---- Category filter bar ---- */}
        {categories.length > 1 && (
          <div className="gallery-filter" role="group" aria-label={t('gallery.filterLabel')}>
            <span className="gallery-filter__label">{t('gallery.filterLabel')}</span>
            <div className="gallery-filter__buttons">
              <button
                className={`btn btn-ghost ${allSelected ? 'active' : ''}`}
                onClick={selectAll}
                aria-pressed={allSelected}
              >
                {t('gallery.allCategories')}
              </button>
              {categories.map((cat) => {
                const isActive = activeCategories?.includes(cat.slug)
                return (
                  <button
                    key={cat.slug}
                    className={`btn btn-ghost ${isActive ? 'active' : ''}`}
                    onClick={() => toggleCategory(cat.slug)}
                    aria-pressed={!!isActive}
                  >
                    {getCategoryName(cat.slug)}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ---- Category sections ---- */}
        {visibleCategories.map((category) => {
          const totalPages = Math.ceil(category.artworks.length / IMAGES_PER_PAGE)
          const currentPage = getPage(category.slug)
          const pageArtworks = category.artworks.slice(
            currentPage * IMAGES_PER_PAGE,
            currentPage * IMAGES_PER_PAGE + IMAGES_PER_PAGE
          )
          const categoryName = getCategoryName(category.slug)

          return (
            <section
              key={category.slug}
              className="gallery-category-card"
              aria-labelledby={`cat-${category.slug}`}
            >
              <h2 id={`cat-${category.slug}`} className="section-heading gallery-category__heading">
                {categoryName}
              </h2>

              {category.artworks.length === 0 ? (
                <p className="gallery-empty">{t('gallery.noImages')}</p>
              ) : (
                <>
                  <div className="gallery-grid">
                    {pageArtworks.map((artwork) => {
                      const imgSrc = artwork.hasThumbnail
                        ? `${BASE}art-gallery/${category.slug}/${artwork.slug}/thumbnail.jpg`
                        : `${BASE}art-gallery/${category.slug}/${artwork.slug}/image.jpg`
                      return (
                        <button
                          key={artwork.slug}
                          className="gallery-card"
                          onClick={() => setLightbox({
                            categorySlug: category.slug,
                            artworkSlug: artwork.slug,
                            artworks: category.artworks,
                          })}
                          aria-label={`View ${artwork.slug.replace(/-/g, ' ')}`}
                        >
                          <img
                            src={imgSrc}
                            alt={artwork.slug.replace(/-/g, ' ')}
                            loading="lazy"
                            className="gallery-card__img"
                          />
                          <div className="gallery-card__overlay" aria-hidden="true">
                            <ZoomIcon />
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="gallery-pagination" aria-label={`Pagination for ${categoryName}`}>
                      <button
                        className="btn btn-ghost gallery-pagination__btn"
                        onClick={() => setPage(category.slug, currentPage - 1)}
                        disabled={currentPage === 0}
                        aria-label={t('gallery.prev')}
                      >
                        <ChevronIcon dir="start" isRTL={isRTL} />
                        {t('gallery.prev')}
                      </button>
                      <span className="gallery-pagination__info" aria-live="polite">
                        {t('gallery.pageOf', { current: currentPage + 1, total: totalPages })}
                      </span>
                      <button
                        className="btn btn-ghost gallery-pagination__btn"
                        onClick={() => setPage(category.slug, currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        aria-label={t('gallery.next')}
                      >
                        {t('gallery.next')}
                        <ChevronIcon dir="end" isRTL={isRTL} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )
        })}
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

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-card__zoom">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

function ChevronIcon({ dir, isRTL }) {
  // SVG points right by default (›)
  // LTR start = ‹ (flip), LTR end = › (no flip)
  // RTL start = › (no flip), RTL end = ‹ (flip)
  const shouldFlip = (dir === 'start') !== isRTL
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="gallery-pagination__chevron"
      style={{ transform: shouldFlip ? 'scaleX(-1)' : 'none' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

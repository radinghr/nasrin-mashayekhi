import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useManifest } from '../hooks/useManifest'
import Lightbox from '../components/Lightbox'
import './Gallery.css'

const BASE = import.meta.env.BASE_URL
const MANIFEST_URL = `${BASE}art-gallery-manifest.json`
const IMAGES_PER_PAGE = 6

export default function Gallery() {
  const { t } = useTranslation()
  const { data, loading, error } = useManifest(MANIFEST_URL)

  // Active category filter — null means "all"
  const [activeCategories, setActiveCategories] = useState(null)
  // Per-category page index: { [categoryName]: pageIndex }
  const [pages, setPages] = useState({})
  // Lightbox state
  const [lightbox, setLightbox] = useState(null) // { src, alt }

  const categories = data?.categories ?? []

  const visibleCategories = useMemo(() => {
    if (!activeCategories || activeCategories.length === 0) return categories
    return categories.filter((c) => activeCategories.includes(c.name))
  }, [categories, activeCategories])

  function toggleCategory(name) {
    setActiveCategories((prev) => {
      if (!prev) {
        // "All" was active → select only this one
        return [name]
      }
      if (prev.includes(name)) {
        const next = prev.filter((n) => n !== name)
        return next.length === 0 ? null : next
      }
      return [...prev, name]
    })
    setPages({})
  }

  function selectAll() {
    setActiveCategories(null)
    setPages({})
  }

  function getPage(categoryName) {
    return pages[categoryName] ?? 0
  }

  function setPage(categoryName, page) {
    setPages((prev) => ({ ...prev, [categoryName]: page }))
  }

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
                const isActive = activeCategories?.includes(cat.name)
                return (
                  <button
                    key={cat.name}
                    className={`btn btn-ghost ${isActive ? 'active' : ''}`}
                    onClick={() => toggleCategory(cat.name)}
                    aria-pressed={!!isActive}
                  >
                    {cat.name.replace(/-/g, ' ')}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ---- Category sections ---- */}
        {visibleCategories.map((category) => {
          const totalPages = Math.ceil(category.images.length / IMAGES_PER_PAGE)
          const currentPage = getPage(category.name)
          const pageImages = category.images.slice(
            currentPage * IMAGES_PER_PAGE,
            currentPage * IMAGES_PER_PAGE + IMAGES_PER_PAGE
          )

          return (
            <section key={category.name} className="gallery-category section" aria-labelledby={`cat-${category.name}`}>
              <h2 id={`cat-${category.name}`} className="section-heading gallery-category__heading">
                {category.name.replace(/-/g, ' ')}
              </h2>

              {category.images.length === 0 ? (
                <p className="gallery-empty">{t('gallery.noImages')}</p>
              ) : (
                <>
                  <div className="gallery-grid">
                    {pageImages.map((filename) => {
                      const src = `${BASE}art-gallery/${category.name}/${filename}`
                      return (
                        <button
                          key={filename}
                          className="gallery-card"
                          onClick={() => setLightbox({ src, alt: filename.replace(/\.[^.]+$/, '').replace(/-/g, ' ') })}
                          aria-label={`View ${filename.replace(/\.[^.]+$/, '').replace(/-/g, ' ')}`}
                        >
                          <img
                            src={src}
                            alt={filename.replace(/\.[^.]+$/, '').replace(/-/g, ' ')}
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

                  {/* ---- Pagination ---- */}
                  {totalPages > 1 && (
                    <div className="gallery-pagination" aria-label={`Pagination for ${category.name}`}>
                      <button
                        className="btn btn-ghost gallery-pagination__btn"
                        onClick={() => setPage(category.name, currentPage - 1)}
                        disabled={currentPage === 0}
                        aria-label={t('gallery.prev')}
                      >
                        <ChevronIcon dir="start" />
                        {t('gallery.prev')}
                      </button>
                      <span className="gallery-pagination__info" aria-live="polite">
                        {t('gallery.pageOf', { current: currentPage + 1, total: totalPages })}
                      </span>
                      <button
                        className="btn btn-ghost gallery-pagination__btn"
                        onClick={() => setPage(category.name, currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        aria-label={t('gallery.next')}
                      >
                        {t('gallery.next')}
                        <ChevronIcon dir="end" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )
        })}
      </div>

      {/* ---- Lightbox ---- */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
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

function ChevronIcon({ dir }) {
  const isEnd = dir === 'end'
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="gallery-pagination__chevron"
      style={{ transform: isEnd ? 'none' : 'scaleX(-1)' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

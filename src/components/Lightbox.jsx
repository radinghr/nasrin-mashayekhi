import { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Lightbox.css'

const BASE = import.meta.env.BASE_URL

export default function Lightbox({ categorySlug, artworkSlug, artworks, lang, isRTL, onClose }) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(
    () => artworks.findIndex((a) => a.slug === artworkSlug)
  )
  const [artworkMeta, setArtworkMeta] = useState(null)
  const [metaLoading, setMetaLoading] = useState(false)

  const current = artworks[currentIndex]

  // Fetch per-artwork metadata when current changes and hasMetadata is true
  useEffect(() => {
    if (!current?.hasMetadata) {
      setArtworkMeta(null)
      return
    }
    let cancelled = false
    setMetaLoading(true)
    setArtworkMeta(null)
    fetch(`${BASE}art-gallery/${categorySlug}/${current.slug}/metadata.json`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) { setArtworkMeta(json); setMetaLoading(false) } })
      .catch(() => { if (!cancelled) { setArtworkMeta(null); setMetaLoading(false) } })
    return () => { cancelled = true }
  }, [categorySlug, current?.slug, current?.hasMetadata])

  const goTo = useCallback((idx) => {
    setCurrentIndex(Math.max(0, Math.min(idx, artworks.length - 1)))
  }, [artworks.length])

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowLeft')  goTo(isRTL ? currentIndex + 1 : currentIndex - 1)
    if (e.key === 'ArrowRight') goTo(isRTL ? currentIndex - 1 : currentIndex + 1)
  }, [onClose, goTo, currentIndex, isRTL])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const imageSrc = `${BASE}art-gallery/${categorySlug}/${current.slug}/image.jpg`
  const metaTitle = artworkMeta?.[lang]?.title || artworkMeta?.en?.title || null
  const metaBody  = artworkMeta?.[lang]?.body  || artworkMeta?.en?.body  || null
  const hasPanel  = current?.hasMetadata && (metaTitle || metaBody || metaLoading)

  const canPrev = currentIndex > 0
  const canNext = currentIndex < artworks.length - 1

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={metaTitle || current.slug}
      onClick={handleBackdropClick}
    >
      {/* Close */}
      <button
        className="lightbox__close"
        onClick={onClose}
        aria-label={t('gallery.closeModal')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="18" y1="6"  x2="6"  y2="18" />
          <line x1="6"  y1="6"  x2="18" y2="18" />
        </svg>
      </button>

      {/* Content panel */}
      <div className={`lightbox__content ${hasPanel ? 'lightbox__content--with-meta' : ''}`}>
        {/* Image */}
        <div className="lightbox__img-wrap">
          <img
            key={current.slug}
            className="lightbox__img"
            src={imageSrc}
            alt={metaTitle || current.slug.replace(/-/g, ' ')}
          />
        </div>

        {/* Metadata panel */}
        {hasPanel && (
          <div className="lightbox__meta">
            {metaLoading ? (
              <div className="lightbox__meta-loading" />
            ) : (
              <>
                {metaTitle && <h3 className="lightbox__meta-title">{metaTitle}</h3>}
                {metaBody  && <p  className="lightbox__meta-body">{metaBody}</p>}
              </>
            )}
          </div>
        )}
      </div>

      {/* Prev arrow */}
      {canPrev && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Previous artwork"
        >
          <ChevronNav dir="prev" isRTL={isRTL} />
        </button>
      )}

      {/* Next arrow */}
      {canNext && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Next artwork"
        >
          <ChevronNav dir="next" isRTL={isRTL} />
        </button>
      )}

      {/* Counter */}
      <div className="lightbox__counter" aria-live="polite">
        {currentIndex + 1} / {artworks.length}
      </div>
    </div>
  )
}

function ChevronNav({ dir, isRTL }) {
  // SVG points right by default.
  // prev in LTR = ‹ (flip), prev in RTL = › (no flip)
  // next in LTR = › (no flip), next in RTL = ‹ (flip)
  const shouldFlip = (dir === 'prev') !== isRTL
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="lightbox__nav-icon"
      style={{ transform: shouldFlip ? 'scaleX(-1)' : 'none' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

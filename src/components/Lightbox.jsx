import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './Lightbox.css'

export default function Lightbox({ src, alt, onClose }) {
  const { t } = useTranslation()

  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

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

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={handleBackdropClick}
    >
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
      <div className="lightbox__content">
        <img
          className="lightbox__img"
          src={src}
          alt={alt}
        />
      </div>
    </div>
  )
}

import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useContact } from '../context/ContactContext'
import './ContactModal.css'

export default function ContactModal({ onClose }) {
  const { t } = useTranslation()
  const contact = useContact()

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

  const [emailCopied, setEmailCopied] = useState(false)

  const email = contact?.email ?? ''
  const phone = contact?.phone ?? ''
  const whatsappRaw = contact?.whatsapp ?? ''
  const instagramHandle = contact?.instagram ?? ''
  const whatsappNumber = whatsappRaw.replace(/[+\s]/g, '')

  function handleEmailClick() {
    if (!email) return
    navigator.clipboard?.writeText(email).then(() => {
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    })
  }

  const emailHref = email ? `mailto:${email}` : '#'
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, '')}` : '#'
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#'
  const instagramHref = instagramHandle ? `https://www.instagram.com/${instagramHandle}` : '#'

  return createPortal(
    <div
      className="contact-modal"
      role="dialog"
      aria-modal="true"
      aria-label={t('contact.title')}
      onClick={handleBackdropClick}
    >
      <div className="contact-modal__panel">
        <button
          className="contact-modal__close"
          onClick={onClose}
          aria-label={t('contact.close')}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="18" y1="6"  x2="6"  y2="18" />
            <line x1="6"  y1="6"  x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="contact-modal__title">{t('contact.title')}</h2>

        <div className="contact-modal__items">
          <div className="contact-modal__item contact-modal__item--email">
            <span className="contact-modal__label">{t('contact.email')}</span>
            <a href={emailHref} className="contact-modal__email-link" onClick={handleEmailClick}>
              {email}
            </a>
            {emailCopied && (
              <span className="contact-modal__copied">{t('contact.emailCopied')}</span>
            )}
          </div>

          <div className="contact-modal__item">
            <span className="contact-modal__label">{t('contact.phone')}</span>
            <a href={phoneHref} className="btn btn-outline contact-modal__cta">
              <PhoneIcon />
              <span dir="ltr">{phone}</span>
            </a>
          </div>

          <div className="contact-modal__item">
            <span className="contact-modal__label">{t('contact.whatsapp')}</span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn contact-modal__whatsapp"
            >
              <WhatsAppIcon />
              <span dir="ltr">{whatsappRaw}</span>
            </a>
          </div>

          {instagramHandle && (
            <div className="contact-modal__item">
              <span className="contact-modal__label">{t('contact.instagram')}</span>
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn contact-modal__instagram"
              >
                <InstagramIcon />
                <span dir="ltr">{instagramHandle}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="contact-modal__icon" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.1-1.1a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="contact-modal__icon" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="contact-modal__icon" aria-hidden="true" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

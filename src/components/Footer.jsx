import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContact } from '../context/ContactContext'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()
  const contact = useContact()
  const year = new Date().getFullYear()

  const [emailCopied, setEmailCopied] = useState(false)

  const phone = contact?.phone ?? ''
  const email = contact?.email ?? ''
  const instagram = contact?.instagram ?? ''

  function handleEmailClick() {
    if (!email) return
    navigator.clipboard?.writeText(email).then(() => {
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    })
  }

  const genericMailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(t('courses.generalEmailSubject'))}&body=${encodeURIComponent(t('courses.generalEmailBody'))}`
    : '#'
  const telHref = phone ? `tel:${phone.replace(/\s/g, '')}` : '#'

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <div className="footer__contact">
          <span className="footer__contact-label">{t('footer.contact')}</span>
          {phone && (
            <a href={telHref} className="footer__link">
              <PhoneIcon />
              <span dir="ltr">{phone}</span>
            </a>
          )}
          {email && (
            <span className="footer__email-wrap">
              <a href={genericMailto} className="footer__link" onClick={handleEmailClick}>
                <EmailIcon />
                <span>{email}</span>
              </a>
              {emailCopied && (
                <span className="footer__copied">{t('contact.emailCopied')}</span>
              )}
            </span>
          )}
          {instagram && (
            <a href={`https://www.instagram.com/${instagram}`} className="footer__link" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              <span>{instagram}</span>
            </a>
          )}
        </div>

        <p className="footer__copyright">
          {t('footer.copyright', { year })}
        </p>
      </div>
    </footer>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="footer__icon" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.1-1.1a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="footer__icon" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="footer__icon" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

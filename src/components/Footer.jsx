import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const phone = t('contact.phone')
  const email = t('contact.email')

  const genericMailto = `mailto:${email}?subject=${encodeURIComponent(t('courses.generalEmailSubject'))}&body=${encodeURIComponent(t('courses.generalEmailBody'))}`
  const telHref = `tel:+989125050989`

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <div className="footer__contact">
          <span className="footer__contact-label">{t('footer.contact')}</span>
          <a href={telHref} className="footer__link">
            <PhoneIcon />
            <span dir="ltr">{phone}</span>
          </a>
          <a href={genericMailto} className="footer__link">
            <EmailIcon />
            <span>{email}</span>
          </a>
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

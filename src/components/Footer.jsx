import { useTranslation } from 'react-i18next'
import { useContact } from '../context/ContactContext'
import './Footer.css'

// SAMPLE — replace instagramUrl once the real Instagram handle is confirmed
const INSTAGRAM_URL_SAMPLE = 'https://www.instagram.com/pababrush.art'

export default function Footer() {
  const { t } = useTranslation()
  const contact = useContact()
  const year = new Date().getFullYear()

  const email     = contact?.email     ?? ''
  const whatsapp  = contact?.whatsapp  ?? ''
  const instagram = contact?.instagram ?? ''

  const instagramUrl = instagram
    ? `https://www.instagram.com/${instagram}`
    : INSTAGRAM_URL_SAMPLE

  const emailHref    = email    ? `mailto:${email}`            : '#'
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}`  : '#'

  return (
    <footer className="foot" role="contentinfo">
      <div className="wrap">
        <div className="foot__grid">
          <div>
            <div className="eyebrow foot__eyebrow">{t('footer.eyebrow')}</div>
            {email && (
              <a className="foot__name serif" href={emailHref}>
                {email}
              </a>
            )}
          </div>
          <nav className="foot__links" aria-label="Social links">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('footer.links.instagram')}
            </a>
            {whatsapp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('footer.links.whatsapp')}
              </a>
            )}
            {email && (
              <a href={emailHref}>
                {t('footer.links.email')}
              </a>
            )}
          </nav>
        </div>
        <p className="foot__fine">
          {t('footer.copyright', { year })}
        </p>
      </div>
    </footer>
  )
}

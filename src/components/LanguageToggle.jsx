import { useTranslation } from 'react-i18next'
import './LanguageToggle.css'

/**
 * Languages map — to add a new language, add an entry here.
 * dir: 'rtl' or 'ltr'
 */
export const LANGUAGES = {
  en: { dir: 'ltr', label: 'EN' },
  fa: { dir: 'rtl', label: 'FA' },
}

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const currentLang = i18n.language?.slice(0, 2) || 'en'

  function switchLanguage() {
    const next = currentLang === 'en' ? 'fa' : 'en'
    i18n.changeLanguage(next)
    const dir = LANGUAGES[next]?.dir ?? 'ltr'
    document.documentElement.setAttribute('lang', next)
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.classList.toggle('rtl', dir === 'rtl')
  }

  return (
    <button
      className="lang-toggle"
      onClick={switchLanguage}
      aria-label={t('nav.toggleLanguage')}
      title={t('nav.toggleLanguage')}
    >
      {t('nav.toggleLanguage')}
    </button>
  )
}

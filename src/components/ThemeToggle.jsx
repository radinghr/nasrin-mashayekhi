import { useTranslation } from 'react-i18next'
import './ThemeToggle.css'

export default function ThemeToggle({ theme, onToggle }) {
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle-standalone"
      onClick={onToggle}
      aria-label={t('nav.toggleTheme')}
      title={t('nav.toggleTheme')}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20 13.2A7.6 7.6 0 1 1 10.8 4 6 6 0 0 0 20 13.2Z" strokeLinejoin="round" />
    </svg>
  )
}

import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import { LANGUAGES } from './LanguageToggle'
import './Navbar.css'

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

export default function Navbar({ theme, onToggleTheme }) {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const lang = i18n.language?.slice(0, 2) || 'en'

  function switchLanguage() {
    const next = lang === 'en' ? 'fa' : 'en'
    i18n.changeLanguage(next)
    const dir = LANGUAGES[next]?.dir ?? 'ltr'
    document.documentElement.setAttribute('lang', next)
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.classList.toggle('rtl', dir === 'rtl')
  }

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!e.target.closest('.nav')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  function handleNavClick() {
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    isActive ? 'navlink is-active' : 'navlink'

  return (
    <header className="nav" role="banner">
      <Logo />

      {/* Desktop nav links */}
      <nav className="nav__links" aria-label="Primary navigation">
        <NavLink to="/" end className={navLinkClass} onClick={handleNavClick}>
          {t('nav.home')}
        </NavLink>
        <NavLink to="/gallery" className={navLinkClass} onClick={handleNavClick}>
          {t('nav.gallery')}
        </NavLink>
        <NavLink to="/courses" className={navLinkClass} onClick={handleNavClick}>
          {t('nav.courses')}
        </NavLink>
      </nav>

      {/* Tools: language toggle + separator + theme toggle */}
      <div className="nav__tools">
        <button
          className="toggle lang-toggle"
          onClick={switchLanguage}
          aria-label={t('nav.toggleLanguage')}
          title={t('nav.toggleLanguage')}
        >
          <b style={{ color: lang === 'en' ? 'var(--ink)' : 'var(--ink-faint)' }}>EN</b>
          <span>/</span>
          <b style={{ color: lang === 'fa' ? 'var(--ink)' : 'var(--ink-faint)', fontFamily: 'var(--fa)' }}>فا</b>
        </button>
        <div className="nav__sep" />
        <button
          className="toggle theme-toggle"
          onClick={onToggleTheme}
          aria-label={t('nav.toggleTheme')}
          title={t('nav.toggleTheme')}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      {/* Hamburger button (mobile only) */}
      <button
        className={`nav__hamburger ${menuOpen ? 'nav__hamburger--open' : ''}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        className={`nav__mobile-menu ${menuOpen ? 'nav__mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'mobile-navlink mobile-navlink--active' : 'mobile-navlink'} onClick={handleNavClick}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'mobile-navlink mobile-navlink--active' : 'mobile-navlink'} onClick={handleNavClick}>
            {t('nav.gallery')}
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'mobile-navlink mobile-navlink--active' : 'mobile-navlink'} onClick={handleNavClick}>
            {t('nav.courses')}
          </NavLink>
        </nav>
        <div className="nav__mobile-tools">
          <button className="toggle lang-toggle" onClick={switchLanguage} aria-label={t('nav.toggleLanguage')}>
            <b style={{ color: lang === 'en' ? 'var(--ink)' : 'var(--ink-faint)' }}>EN</b>
            <span>/</span>
            <b style={{ color: lang === 'fa' ? 'var(--ink)' : 'var(--ink-faint)', fontFamily: 'var(--fa)' }}>فا</b>
          </button>
          <button className="toggle theme-toggle" onClick={onToggleTheme} aria-label={t('nav.toggleTheme')}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

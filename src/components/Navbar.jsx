import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import ContactModal from './ContactModal'
import './Navbar.css'

export default function Navbar({ theme, onToggleTheme }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!e.target.closest('.navbar')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  function handleNavClick() {
    setMenuOpen(false)
  }

  function handleAboutClick(e) {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#about')
    }
  }

  function handleContactClick(e) {
    e.preventDefault()
    setMenuOpen(false)
    setContactOpen(true)
  }

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__inner container">
          <Logo />

          {/* Desktop nav links */}
          <nav className="navbar__links" aria-label="Primary navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              {t('nav.gallery')}
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              {t('nav.courses')}
            </NavLink>
            <a href="/#about" className="nav-link" onClick={handleAboutClick}>
              {t('nav.aboutMe')}
            </a>
            <button className="nav-link nav-link--button" onClick={handleContactClick}>
              {t('nav.contactMe')}
            </button>
          </nav>

          {/* Controls */}
          <div className="navbar__controls">
            <LanguageToggle />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          id="mobile-menu"
          className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <nav aria-label="Mobile navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'mobile-nav-link mobile-nav-link--active' : 'mobile-nav-link'} onClick={handleNavClick}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'mobile-nav-link mobile-nav-link--active' : 'mobile-nav-link'} onClick={handleNavClick}>
              {t('nav.gallery')}
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'mobile-nav-link mobile-nav-link--active' : 'mobile-nav-link'} onClick={handleNavClick}>
              {t('nav.courses')}
            </NavLink>
            <a href="/#about" className="mobile-nav-link" onClick={handleAboutClick}>
              {t('nav.aboutMe')}
            </a>
            <button className="mobile-nav-link mobile-nav-link--button" onClick={handleContactClick}>
              {t('nav.contactMe')}
            </button>
          </nav>
          <div className="navbar__mobile-controls">
            <LanguageToggle />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}

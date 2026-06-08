import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Courses from './pages/Courses'
import { LANGUAGES } from './components/LanguageToggle'

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export default function App() {
  const { i18n } = useTranslation()
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply theme attribute to <html> and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Sync lang and dir attributes on language change
  useEffect(() => {
    const lang = i18n.language?.slice(0, 2) || 'en'
    const dir = LANGUAGES[lang]?.dir ?? 'ltr'
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.classList.toggle('rtl', dir === 'rtl')
  }, [i18n.language])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <>
      <a href="#main-content" className="visually-hidden">Skip to content</a>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
      <Footer />
    </>
  )
}

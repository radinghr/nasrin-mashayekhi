import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import './Home.css'

export default function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRTL = i18n.dir() === 'rtl'

  useEffect(() => {
    if (window.location.hash === '#about') {
      const el = document.getElementById('about')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  function goGallery(e) {
    e.preventDefault()
    navigate('/gallery')
  }

  return (
    <main className="page home-page page-fade" id="main-content">

      {/* ──────────────────────────── HERO ──────────────────── */}
      <header className="hero wrap-wide">
        <div className="hero__text">
          <div className="eyebrow">{t('hero.role')}</div>

          <h1 className="hero__name display">
            <span className="ln">{t('name.first')}</span>
            <span className={`ln ln-2${isRTL ? ' ln-2--rtl' : ''}`}>
              {t('name.last')}
            </span>
          </h1>

          <p className="hero__tag">{t('home.heroParagraph1')}</p>

          {/* Meta trio — SAMPLE, replace values in translation files */}
          <div className="hero__meta">
            <div>
              <span className="k">{t('hero.meta.based.label')}</span>
              <span className="v serif">{t('hero.meta.based.value')}</span>
            </div>
            <div>
              <span className="k">{t('hero.meta.working.label')}</span>
              <span className="v serif">{t('hero.meta.working.value')}</span>
            </div>
            <div>
              <span className="k">{t('hero.meta.medium.label')}</span>
              <span className="v serif">{t('hero.meta.medium.value')}</span>
            </div>
          </div>

          <button className="hero__cta" onClick={goGallery}>
            {t('hero.cta')}
            <span className="arrow" aria-hidden="true" />
          </button>
        </div>

        <div className="hero__art-wrap">
          <div className="hero__art">
            <img
              className="hero__art-img"
              loading="lazy"
              src={heroImg}
              alt={t('hero.caption')}
            />
          </div>
          {/* Caption + index — SAMPLE, replace in translation files */}
          <div className="hero__art-cap">{t('hero.caption')}</div>
          <div className="hero__index">{t('hero.index')}</div>
        </div>
      </header>

      <div className="wrap">

        {/* ──────────────────────────── BIO ───────────────────── */}
        <section id="about" className="section" aria-labelledby="bio-heading">
          <div className="bio">
            <div className="bio__head">
              <div className="eyebrow" id="bio-heading">{t('home.bioHeading')}</div>
              <h2 className="bio__display display">{t('home.bioDisplayHead')}</h2>
            </div>
            <div className="bio__body">
              <p>{t('home.bioParagraph')}</p>
              <blockquote className="bio__quote-block">
                <p className="bio__quote">{t('home.bioQuote')}</p>
                <cite className="bio__quote-author">{t('home.bioQuoteAuthor')}</cite>
              </blockquote>
              <p>{t('home.heroParagraph2')}</p>
              <p>{t('home.heroParagraph3')}</p>
            </div>
          </div>

          {/* ──────────────── EDUCATION FACTS ─────────────────── */}
          <div className="facts" aria-label={t('home.educationHeading')}>
            <div className="fact">
              <div className="y">{t('home.edu1Year')}</div>
              <div className="t">{t('home.edu1Title')}</div>
              <div className="s">{t('home.edu1School')}</div>
            </div>
            <div className="fact">
              <div className="y">{t('home.edu2Year')}</div>
              <div className="t">{t('home.edu2Title')}</div>
              <div className="s">{t('home.edu2School')}</div>
            </div>
          </div>
        </section>

        {/* ──────────────────────── EXHIBITIONS ───────────────── */}
        <section className="section" aria-labelledby="exhibit-heading">
          <div className="section__head">
            <div>
              <div className="eyebrow">{t('home.activitiesHeading')}</div>
              <h2 id="exhibit-heading" className="display section__head-title">
                {t('home.exhibitionsHeading')}
              </h2>
            </div>
            <span className="count">{t('home.exhibitionsCount')}</span>
          </div>

          <div className="exhibit">
            <div className="exhibit__row">
              <span className="exhibit__yr">{t('home.exhibit1Year')}</span>
              <span className="exhibit__ti">{t('home.exhibit1Title')}</span>
              <span className="exhibit__pl">{t('home.exhibit1Place')}</span>
            </div>
            <div className="exhibit__row">
              <span className="exhibit__yr">{t('home.exhibit2Year')}</span>
              <span className="exhibit__ti">{t('home.exhibit2Title')}</span>
              <span className="exhibit__pl">{t('home.exhibit2Place')}</span>
            </div>
            <div className="exhibit__row">
              <span className="exhibit__yr">{t('home.exhibit3Year')}</span>
              <span className="exhibit__ti">{t('home.exhibit3Title')}</span>
              <span className="exhibit__pl">{t('home.exhibit3Place')}</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

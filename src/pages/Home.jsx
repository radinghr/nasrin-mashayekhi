import { useTranslation } from 'react-i18next'
import './Home.css'

export default function Home() {
  const { t } = useTranslation()

  return (
    <main className="page home-page" id="main-content">
      <div className="container">

        {/* ---- Hero / Artist Statement ---- */}
        <section className="section home-hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="home-hero__greeting">
            {t('home.heroGreeting')}
          </h1>
          <div className="home-hero__text">
            <p>{t('home.heroParagraph1')}</p>
            <p>{t('home.heroParagraph2')}</p>
            <p>{t('home.heroParagraph3')}</p>
          </div>
        </section>

        <hr className="divider" />

        {/* ---- Bio ---- */}
        <section className="section home-bio" aria-labelledby="bio-heading">
          <h2 id="bio-heading" className="section-heading">{t('home.bioHeading')}</h2>

          <div className="home-bio__header">
            <p className="home-bio__name">{t('home.bioName')}</p>
            <p className="home-bio__birth">{t('home.bioBirth')}</p>
          </div>

          <p className="home-bio__para">
            {t('home.bioParagraph')}{' '}
            <em className="home-bio__quote">
              {t('home.bioQuote')}
            </em>{' '}
            {t('home.bioQuoteAuthor')}
          </p>
        </section>

        {/* ---- Education ---- */}
        <section className="section home-education" aria-labelledby="edu-heading">
          <h2 id="edu-heading" className="section-heading">{t('home.educationHeading')}</h2>
          <ul className="home-list">
            <li className="home-list__item">
              <span className="home-list__dot" aria-hidden="true" />
              {t('home.edu1')}
            </li>
            <li className="home-list__item">
              <span className="home-list__dot" aria-hidden="true" />
              {t('home.edu2')}
            </li>
          </ul>
        </section>

        {/* ---- Art Activities ---- */}
        <section className="section home-activities" aria-labelledby="activities-heading">
          <h2 id="activities-heading" className="section-heading">{t('home.activitiesHeading')}</h2>
          <ul className="home-list">
            <li className="home-list__item">
              <span className="home-list__dot" aria-hidden="true" />
              {t('home.activity1')}
            </li>
            <li className="home-list__item">
              <span className="home-list__dot" aria-hidden="true" />
              {t('home.activity2')}
            </li>
            <li className="home-list__item">
              <span className="home-list__dot" aria-hidden="true" />
              {t('home.activity3')}
            </li>
          </ul>
        </section>

      </div>
    </main>
  )
}

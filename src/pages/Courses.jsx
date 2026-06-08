import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useManifest } from '../hooks/useManifest'
import './Courses.css'

const BASE = import.meta.env.BASE_URL
const MANIFEST_URL = `${BASE}courses-manifest.json`

const EMAIL = 'radiingh@gmail.com'
const PHONE_DISPLAY = '+98 912 505 0989'
const PHONE_HREF = 'tel:+989125050989'

export default function Courses() {
  const { t, i18n } = useTranslation()
  const { data, loading, error } = useManifest(MANIFEST_URL)
  const lang = i18n.language?.slice(0, 2) || 'en'

  const courseNames = data?.courses ?? []

  if (loading) return <main className="page courses-page"><div className="container courses-loading">{t('courses.loading')}</div></main>
  if (error)   return <main className="page courses-page"><div className="container courses-error">{error}</div></main>

  const genericMailto = buildMailto(EMAIL,
    t('courses.generalEmailSubject'),
    t('courses.generalEmailBody')
  )

  return (
    <main className="page courses-page" id="main-content">
      <div className="container">
        <h1 className="courses-title">{t('courses.pageTitle')}</h1>

        {courseNames.length === 0 ? (
          <p className="courses-empty">{t('courses.noCourses')}</p>
        ) : (
          <div className="courses-grid">
            {courseNames.map((name) => (
              <CourseCard key={name} name={name} lang={lang} t={t} />
            ))}
          </div>
        )}

        {/* ---- Contact callout ---- */}
        <section className="courses-contact section" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="courses-contact__heading">{t('courses.contactHeading')}</h2>
          <p className="courses-contact__subtext">{t('courses.contactSubtext')}</p>
          <div className="courses-contact__links">
            <a href={PHONE_HREF} className="courses-contact__link">
              <PhoneIcon />
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>
            <a href={genericMailto} className="courses-contact__link">
              <EmailIcon />
              <span>{EMAIL}</span>
            </a>
          </div>
        </section>

      </div>
    </main>
  )
}

/* ---- Individual course card ---------------------------------- */
function CourseCard({ name, lang, t }) {
  const [info, setInfo] = useState(null)
  const [loadErr, setLoadErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${BASE}courses/${name}/course-info.json`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((json) => { if (!cancelled) setInfo(json) })
      .catch(() => { if (!cancelled) setLoadErr(true) })
    return () => { cancelled = true }
  }, [name])

  if (loadErr) return null
  if (!info) return <div className="course-card course-card--skeleton" aria-hidden="true" />

  const localized = info[lang] ?? info.en ?? {}
  const { course_title, course_information, duration, price, level } = localized

  const imgSrc = `${BASE}courses/${name}/course-image.jpg`
  const mailto = buildMailto(
    EMAIL,
    t('courses.emailSubject', { title: course_title }),
    t('courses.emailBody', { title: course_title })
  )

  return (
    <article className="card course-card">
      <div className="course-card__img-wrap">
        <img
          src={imgSrc}
          alt={course_title}
          loading="lazy"
          className="course-card__img"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <div className="course-card__body">
        <div className="course-card__meta">
          {level && <span className="course-card__level">{level}</span>}
        </div>
        <h2 className="course-card__title">{course_title}</h2>
        {course_information && (
          <p className="course-card__info">{course_information}</p>
        )}
        <dl className="course-card__details">
          {duration && (
            <div className="course-card__detail-item">
              <dt>{t('courses.duration')}</dt>
              <dd>{duration}</dd>
            </div>
          )}
          {price && (
            <div className="course-card__detail-item">
              <dt>{t('courses.price')}</dt>
              <dd>{price}</dd>
            </div>
          )}
        </dl>
        <a href={mailto} className="btn btn-primary course-card__enroll">
          {t('courses.enrollButton')}
        </a>
      </div>
    </article>
  )
}

function buildMailto(to, subject, body) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="courses-contact__icon" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.1-1.1a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="courses-contact__icon" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

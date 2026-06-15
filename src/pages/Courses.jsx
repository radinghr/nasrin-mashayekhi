import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useManifest } from '../hooks/useManifest'
import { useContact } from '../context/ContactContext'
import './Courses.css'

const BASE = import.meta.env.BASE_URL
const MANIFEST_URL = `${BASE}courses-manifest.json`

export default function Courses() {
  const { t, i18n } = useTranslation()
  const { data, loading, error } = useManifest(MANIFEST_URL)
  const contact = useContact()
  const lang = i18n.language?.slice(0, 2) || 'en'

  const courseNames = data?.courses ?? []
  const email    = contact?.email   ?? ''
  const phone    = contact?.phone   ?? ''
  const whatsapp = contact?.whatsapp ?? ''

  const genericMailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(t('courses.generalEmailSubject'))}&body=${encodeURIComponent(t('courses.generalEmailBody'))}`
    : '#'
  const telHref = phone ? `tel:${phone.replace(/\s/g, '')}` : '#'

  if (loading) {
    return (
      <main className="page courses-page">
        <div className="wrap courses-loading">{t('courses.loading')}</div>
      </main>
    )
  }
  if (error) {
    return (
      <main className="page courses-page">
        <div className="wrap courses-error">{error}</div>
      </main>
    )
  }

  return (
    <main className="page courses-page page-fade" id="main-content">
      <div className="wrap">

        {/* Header */}
        <div className="gal-head">
          <div className="eyebrow">{t('courses.head')}</div>
          <h1 className="display gal-head__title">{t('courses.pageTitle')}</h1>
          <p className="courses-intro">{t('courses.intro')}</p>
        </div>

        {/* Course cards */}
        {courseNames.length === 0 ? (
          <p className="courses-empty">{t('courses.noCourses')}</p>
        ) : (
          <div className="courses-list">
            {courseNames.map((name, idx) => (
              <CourseCard
                key={name}
                name={name}
                index={idx + 1}
                lang={lang}
                t={t}
                whatsapp={whatsapp}
              />
            ))}
          </div>
        )}

        {/* Contact callout — keep existing links */}
        <section className="courses-contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="courses-contact__heading serif">
            {t('courses.contactHeading')}
          </h2>
          <p className="courses-contact__subtext">{t('courses.contactSubtext')}</p>
          <div className="courses-contact__links">
            {phone && (
              <a href={telHref} className="courses-contact__link">
                <span dir="ltr">{phone}</span>
              </a>
            )}
            {email && (
              <a href={genericMailto} className="courses-contact__link">
                {email}
              </a>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}

/* ---- Individual course poster card -------------------------- */
function CourseCard({ name, index, lang, t, whatsapp }) {
  const [info, setInfo] = useState(null)
  const [loadErr, setLoadErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${BASE}courses/${name}/course-info.json`)
      .then((r) => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then((json) => { if (!cancelled) setInfo(json) })
      .catch(() => { if (!cancelled) setLoadErr(true) })
    return () => { cancelled = true }
  }, [name])

  if (loadErr) return null
  if (!info) return <div className="course course--skeleton" aria-hidden="true" />

  const localized = info[lang] ?? info.en ?? {}
  const { course_title, course_information, duration, price, level, bonus, access, support } = localized

  const imgSrc = `${BASE}courses/${name}/course-image.jpg`

  // Zero-padded course number, localized digits for Persian
  const courseNo = lang === 'fa'
    ? String(index).padStart(2, '0').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
    : String(index).padStart(2, '0')

  function handleEnroll() {
    if (!whatsapp) return
    const msg = t('courses.enrollPrefill', { title: course_title })
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  return (
    <article className="course">
      <div className="course__poster">
        <img
          loading="lazy"
          src={imgSrc}
          alt={course_title}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      <div className="course__text">
        <div style={{ position: 'relative' }}>
          <div className="course__no" aria-hidden="true">{courseNo}</div>
          <div className="eyebrow">{t('courses.head')}</div>
          <h2 className="course__title">{course_title}</h2>
        </div>

        {course_information && (
          <p className="course__lede">{course_information}</p>
        )}

        <div className="course__rows">
          {level && (
            <div className="course__row">
              <span className="lab">{t('courses.labels.level')}</span>
              <span className="val">{level}</span>
            </div>
          )}
          {bonus && (
            <div className="course__row">
              <span className="lab">{t('courses.labels.bonus')}</span>
              <span className="val">{bonus}</span>
            </div>
          )}
          {access && (
            <div className="course__row">
              <span className="lab">{t('courses.labels.access')}</span>
              <span className="val">{access}</span>
            </div>
          )}
          {support && (
            <div className="course__row">
              <span className="lab">{t('courses.labels.support')}</span>
              <span className="val">{support}</span>
            </div>
          )}
        </div>

        <div className="course__foot">
          {price && (
            <div className="course__price">
              {price}
            </div>
          )}
          {duration && (
            <div className="course__dur">{duration}</div>
          )}
          <button className="btn-line" onClick={handleEnroll}>
            {t('courses.labels.enroll')}
          </button>
        </div>
      </div>
    </article>
  )
}

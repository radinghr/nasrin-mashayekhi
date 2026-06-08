import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import fa from './locales/fa/translation.json'

/**
 * To add a new language:
 *  1. Create src/locales/[lang]/translation.json with all keys translated.
 *  2. Import it above.
 *  3. Add it to the `resources` object below.
 *  4. Add the lang code + dir to the LANGUAGES map in src/components/LanguageToggle.jsx.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fa: { translation: fa },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fa'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

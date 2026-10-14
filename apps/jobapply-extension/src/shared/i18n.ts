import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './translations.json'

void i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'translation',
  resources: {
    'pt-BR': { translation: translations['pt-BR'] },
    en: { translation: translations.en },
  },
  interpolation: { escapeValue: false },
})

export default i18next

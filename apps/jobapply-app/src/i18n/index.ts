import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './translations.json'

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: translations['pt-BR'] },
    en: { translation: translations['en'] },
  },
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './translations.json'

const browserLang = navigator.language
const supportedLng = browserLang.startsWith('pt') ? 'pt-BR' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: translations['pt-BR'] },
    en: { translation: translations['en'] },
  },
  lng: supportedLng,
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

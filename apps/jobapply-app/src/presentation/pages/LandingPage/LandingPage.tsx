import { useTranslation } from 'react-i18next'
import { auroraCls, auroraBlob1Cls, auroraBlob2Cls, auroraBlob3Cls, auroraBlob4Cls, auroraVeilCls, tokens } from './LandingPage.styles'
import { useRevealOnScroll } from './useRevealOnScroll'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import FeaturesSection from './components/FeaturesSection'
import StepsSection from './components/StepsSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

function Aurora() {
  return (
    <div className={auroraCls} aria-hidden="true">
      <div className={auroraBlob1Cls} />
      <div className={auroraBlob2Cls} />
      <div className={auroraBlob3Cls} />
      <div className={auroraBlob4Cls} />
      <div className={auroraVeilCls} />
    </div>
  )
}

export default function LandingPage() {
  useTranslation()
  useRevealOnScroll()
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: tokens.bg, color: tokens.ink, fontFamily: "'Lato','Verdana',sans-serif" }}>
      <Aurora />
      <Topbar />
      <main>
        <Hero />
        <div id="recursos" />
        <div id="como-funciona" />
        <FeaturesSection />
        <StepsSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Aurora, AuroraBlob1, AuroraBlob2, AuroraBlob3, AuroraBlob4, AuroraVeil, PageRoot } from './LandingPage.styles'
import { useRevealOnScroll } from './useRevealOnScroll'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import FeaturesSection from './components/FeaturesSection'
import StepsSection from './components/StepsSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

function AuroraBgs() {
  return (
    <Aurora aria-hidden="true">
      <AuroraBlob1 />
      <AuroraBlob2 />
      <AuroraBlob3 />
      <AuroraBlob4 />
      <AuroraVeil />
    </Aurora>
  )
}

export default function LandingPage() {
  useTranslation()
  useRevealOnScroll()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])
  return (
    <PageRoot>
      <AuroraBgs />
      <Topbar />
      <main>
        <Hero />
        <div id="recursos" />
        <FeaturesSection />
        <div id="como-funciona" />
        <StepsSection />
        <FinalCTA />
      </main>
      <Footer />
    </PageRoot>
  )
}

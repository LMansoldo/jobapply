import { useTranslation } from 'react-i18next'
import { auroraCls, auroraBlob1Cls, auroraBlob2Cls, auroraBlob3Cls, auroraBlob4Cls, auroraVeilCls, tokens } from './LandingPage.styles'
import { useRevealOnScroll } from './useRevealOnScroll'
import Topbar from './components/Topbar'
import Hero from './components/Hero'

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
        {/* Task 6: FeaturesSection */}
        {/* Task 7: StepsSection, FinalCTA */}
      </main>
      {/* Task 7: Footer */}
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { SectionHero, Display, Accent, Lead, BtnDarkLg, BtnGhostLg, revealHeroStyles, tokens } from '../LandingPage.styles'
import AppScreenshot from './AppScreenshot'
import { HeroCtas } from './Hero.styles'

const HeroTitle = styled(Display)`${revealHeroStyles}`
const HeroSub = styled.div`display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:48px;flex-wrap:wrap;${revealHeroStyles}`
const HeroShot = styled.div`margin-top:80px;position:relative;${revealHeroStyles}`
const Hl = styled.span`color:${tokens.ink};font-weight:700`

export default function Hero() {
  const { t } = useTranslation()
  return (
    <SectionHero>
      <HeroTitle data-reveal="hero">
        {t('landing.hero.title1')}<br />{t('landing.hero.title2')}<br />
        {t('landing.hero.title3')} <Accent>{t('landing.hero.titleAccent')}</Accent>.
      </HeroTitle>
      <HeroSub data-reveal="hero">
        <Lead>
          {t('landing.hero.leadPre')}<Hl>{t('landing.hero.leadHl')}</Hl>{t('landing.hero.leadPost')}
        </Lead>
        <HeroCtas>
          <BtnDarkLg href="/register">{t('landing.hero.ctaMain')} →</BtnDarkLg>
          <BtnGhostLg href="#como-funciona">{t('landing.hero.ctaSec')}</BtnGhostLg>
        </HeroCtas>
      </HeroSub>
      <HeroShot data-reveal="hero">
        <AppScreenshot />
      </HeroShot>
    </SectionHero>
  )
}

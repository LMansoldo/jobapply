import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { SectionCtaBelowFold, HeadingCta, AccentCyan, BtnDarkXl, RevealFade, tokens } from '../LandingPage.styles'
import { CtaInner, CtaActions } from './FinalCTA.styles'

const mm = '@media (prefers-reduced-motion: no-preference)'
const drift = keyframes`0%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}33%{transform:translate3d(6%,-2%,0) rotate(40deg) scale(1.25)}66%{transform:translate3d(-4%,8%,0) rotate(-25deg) scale(1.15)}100%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}`
const CtaPanel = styled(RevealFade)`position:relative;overflow:hidden;padding:100px 60px;text-align:center;background:rgba(255,255,255,.7);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.85);box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9);border-radius:32px`
const BlobWrap = styled.div`position:absolute;inset:0;overflow:hidden;pointer-events:none`
const Blob1 = styled.div`position:absolute;top:-40%;left:20%;width:60%;height:200%;background:radial-gradient(closest-side,rgba(139,92,246,.35),transparent 70%);filter:blur(70px);${mm}{animation:${drift} 24s ease-in-out infinite}`
const Blob2 = styled.div`position:absolute;top:-30%;right:10%;width:50%;height:180%;background:radial-gradient(closest-side,rgba(6,182,212,.3),transparent 70%);filter:blur(80px);${mm}{animation:${drift} 30s ease-in-out infinite}`
const LeadCta = styled.p`font-size:20px;color:${tokens.fgSoft};margin:32px auto 0;max-width:560px`

export default function FinalCTA() {
  const { t } = useTranslation()
  return (
    <SectionCtaBelowFold>
      <CtaPanel data-reveal="fade">
        <BlobWrap aria-hidden="true"><Blob1 /><Blob2 /></BlobWrap>
        <CtaInner>
          <HeadingCta>{t('landing.cta.headingPre')}<AccentCyan>{t('landing.cta.headingAccent')}</AccentCyan>{t('landing.cta.headingPost')}</HeadingCta>
          <LeadCta>{t('landing.cta.lead')}</LeadCta>
          <CtaActions>
            <BtnDarkXl href="/register">{t('landing.cta.btn')} →</BtnDarkXl>
          </CtaActions>
        </CtaInner>
      </CtaPanel>
    </SectionCtaBelowFold>
  )
}

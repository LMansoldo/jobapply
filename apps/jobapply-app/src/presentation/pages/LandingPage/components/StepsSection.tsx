import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { SectionStepsBelowFold, Heading, AccentPink, glassStyles, revealFadeStyles, tokens } from '../LandingPage.styles'
import { steps } from '../data'
import { StepsIntro } from './StepsSection.styles'

const Grid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:24px;@media (max-width:1040px){grid-template-columns:repeat(2,1fr)}@media (max-width:560px){grid-template-columns:1fr}`
const StepCard = styled.div`padding:40px;border-radius:24px;min-height:300px;position:relative;${glassStyles}${revealFadeStyles}`
const Num = styled.div`font-family:'Lato','Verdana',sans-serif;font-weight:900;font-size:112px;line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(10,10,18,.16);letter-spacing:-.04em`
const Title = styled.h3`font-family:'Lato','Verdana',sans-serif;font-weight:700;font-size:26px;line-height:1.15;letter-spacing:-.02em;margin:20px 0 12px;color:${tokens.ink}`
const Desc = styled.p`font-size:15px;line-height:1.55;color:rgba(10,10,18,.6);margin:0`

export default function StepsSection() {
  const { t } = useTranslation()
  return (
    <SectionStepsBelowFold>
      <StepsIntro data-reveal="fade">
        <Heading>{t('landing.steps.headingPre')}<AccentPink>{t('landing.steps.headingAccent')}</AccentPink>{t('landing.steps.headingPost')}</Heading>
      </StepsIntro>
      <Grid>
        {steps.map(s => (
          <StepCard data-reveal="fade" key={s.n}>
            <Num>{s.n}</Num>
            <Title>{t(`landing.steps.items.${s.key}.title`)}</Title>
            <Desc>{t(`landing.steps.items.${s.key}.desc`)}</Desc>
          </StepCard>
        ))}
      </Grid>
    </SectionStepsBelowFold>
  )
}

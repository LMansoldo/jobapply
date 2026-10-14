import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { SectionBelowFold, Heading, AccentCyan, RevealFade, revealFadeStyles, tokens } from '../LandingPage.styles'
import { features } from '../data'
import EditorMock from './EditorMock'
import { FeatureLead, FeatDot, MockWrap } from './FeaturesSection.styles'

const FeatureIntro = styled(RevealFade)`max-width:900px`
const Split = styled.div`display:grid;grid-template-columns:0.9fr 1.1fr;gap:60px;margin-top:80px;align-items:start;@media (max-width:900px){grid-template-columns:1fr;gap:40px}`
const List = styled.div`display:flex;flex-direction:column;position:sticky;top:120px;@media (max-width:900px){position:static}${revealFadeStyles}`
const Feat = styled.div`padding:22px 0;border-top:1px solid rgba(10,10,18,.1);display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center`
const Num = styled.div`font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(10,10,18,.35);letter-spacing:.1em;width:28px`
const Title = styled.h3`font-family:'Lato','Verdana',sans-serif;font-weight:700;font-size:22px;line-height:1.15;letter-spacing:-.015em;margin:0 0 4px;color:${tokens.ink}`
const Desc = styled.p`font-size:13px;line-height:1.5;color:rgba(10,10,18,.55);margin:0`
const Tag = styled.div`display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.7);border:1px solid ${tokens.line};color:rgba(10,10,18,.7);font-family:'JetBrains Mono',monospace;white-space:nowrap;box-shadow:0 4px 12px rgba(20,20,50,.06)`

export default function FeaturesSection() {
  const { t } = useTranslation()
  return (
    <SectionBelowFold>
      <FeatureIntro data-reveal="fade">
        <Heading>{t('landing.features.headingPre')}<AccentCyan>{t('landing.features.headingAccent')}</AccentCyan>.</Heading>
        <FeatureLead>{t('landing.features.sub')}</FeatureLead>
      </FeatureIntro>
      <Split>
        <List data-reveal="fade">
          {features.map(f => (
            <Feat key={f.n}>
              <Num>{f.n}</Num>
              <div>
                <Title>{t(`landing.features.items.${f.key}.title`)}</Title>
                <Desc>{t(`landing.features.items.${f.key}.desc`)}</Desc>
              </div>
              <Tag>
                <FeatDot $color={f.dot} />
                {t(`landing.features.items.${f.key}.tag`)}
              </Tag>
            </Feat>
          ))}
        </List>
        <MockWrap data-reveal="fade">
          <EditorMock />
        </MockWrap>
      </Split>
    </SectionBelowFold>
  )
}

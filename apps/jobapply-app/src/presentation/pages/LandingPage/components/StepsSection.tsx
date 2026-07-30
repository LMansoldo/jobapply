import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { sectionStepsCls, headingCls, accentPinkCls, glassCls, fadeInCls, tokens } from '../LandingPage.styles'
import { steps } from '../data'

const gridCls = css`display:grid;grid-template-columns:repeat(4,1fr);gap:24px;@media (max-width:1040px){grid-template-columns:repeat(2,1fr)}@media (max-width:560px){grid-template-columns:1fr}`
const stepCls = css`padding:40px;border-radius:24px;min-height:300px;position:relative`
const numCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:900;font-size:112px;line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(10,10,18,.16);letter-spacing:-.04em`
const titleCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:700;font-size:26px;line-height:1.15;letter-spacing:-.02em;margin:20px 0 12px;color:${tokens.ink}`
const descCls = css`font-size:15px;line-height:1.55;color:rgba(10,10,18,.6);margin:0`

export default function StepsSection() {
  const { t } = useTranslation()
  return (
    <section className={sectionStepsCls}>
      <div className={fadeInCls} style={{ maxWidth: 900, marginBottom: 80 }}>
        <h2 className={headingCls}>{t('landing.steps.headingPre')}<span className={accentPinkCls}>{t('landing.steps.headingAccent')}</span>{t('landing.steps.headingPost')}</h2>
      </div>
      <div className={gridCls}>
        {steps.map(s => (
          <div className={`${stepCls} ${glassCls} ${fadeInCls}`} key={s.n}>
            <div className={numCls}>{s.n}</div>
            <h3 className={titleCls}>{t(`landing.steps.items.${s.key}.title`)}</h3>
            <p className={descCls}>{t(`landing.steps.items.${s.key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

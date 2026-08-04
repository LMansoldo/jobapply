import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { sectionBelowFoldCls, headingCls, accentCyanCls, leadSmCls, fadeInCls, tokens } from '../LandingPage.styles'
import { features } from '../data'
import EditorMock from './EditorMock'

const splitCls = css`display:grid;grid-template-columns:0.9fr 1.1fr;gap:60px;margin-top:80px;align-items:start;@media (max-width:900px){grid-template-columns:1fr;gap:40px}`
const listCls = css`display:flex;flex-direction:column;position:sticky;top:120px;@media (max-width:900px){position:static}`
const featCls = css`padding:22px 0;border-top:1px solid rgba(10,10,18,.1);display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center`
const numCls = css`font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(10,10,18,.35);letter-spacing:.1em;width:28px`
const titleCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:700;font-size:22px;line-height:1.15;letter-spacing:-.015em;margin:0 0 4px;color:${tokens.ink}`
const descCls = css`font-size:13px;line-height:1.5;color:rgba(10,10,18,.55);margin:0`
const tagCls = css`display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.7);border:1px solid ${tokens.line};color:rgba(10,10,18,.7);font-family:'JetBrains Mono',monospace;white-space:nowrap;box-shadow:0 4px 12px rgba(20,20,50,.06)`

export default function FeaturesSection() {
  const { t } = useTranslation()
  return (
    <section className={sectionBelowFoldCls}>
      <div className={fadeInCls} style={{ maxWidth: 900 }}>
        <h2 className={headingCls}>{t('landing.features.headingPre')}<span className={accentCyanCls}>{t('landing.features.headingAccent')}</span>.</h2>
        <p className={leadSmCls} style={{ marginTop: 28 }}>{t('landing.features.sub')}</p>
      </div>
      <div className={splitCls}>
        <div className={`${listCls} ${fadeInCls}`}>
          {features.map(f => (
            <div className={featCls} key={f.n}>
              <div className={numCls}>{f.n}</div>
              <div>
                <h3 className={titleCls}>{t(`landing.features.items.${f.key}.title`)}</h3>
                <p className={descCls}>{t(`landing.features.items.${f.key}.desc`)}</p>
              </div>
              <div className={tagCls}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: f.dot, boxShadow: `0 0 8px ${f.dot}` }} />
                {t(`landing.features.items.${f.key}.tag`)}
              </div>
            </div>
          ))}
        </div>
        <div className={fadeInCls} style={{ position: 'relative' }}>
          <EditorMock />
        </div>
      </div>
    </section>
  )
}

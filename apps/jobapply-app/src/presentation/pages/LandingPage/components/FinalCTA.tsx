import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { css, keyframes } from '@emotion/css'
import { sectionCtaBelowFoldCls, headingCtaCls, accentCyanCls, panelCls, btnDarkXlCls, fadeInCls, tokens } from '../LandingPage.styles'

const mm = '@media (prefers-reduced-motion: no-preference)'
const drift = keyframes`0%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}33%{transform:translate3d(6%,-2%,0) rotate(40deg) scale(1.25)}66%{transform:translate3d(-4%,8%,0) rotate(-25deg) scale(1.15)}100%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}`
const ctaCls = css`position:relative;overflow:hidden;padding:100px 60px;text-align:center`
const blobWrap = css`position:absolute;inset:0;overflow:hidden;pointer-events:none`
const blob1 = css`position:absolute;top:-40%;left:20%;width:60%;height:200%;background:radial-gradient(closest-side,rgba(139,92,246,.35),transparent 70%);filter:blur(70px);${mm}{animation:${drift} 24s ease-in-out infinite}`
const blob2 = css`position:absolute;top:-30%;right:10%;width:50%;height:180%;background:radial-gradient(closest-side,rgba(6,182,212,.3),transparent 70%);filter:blur(80px);${mm}{animation:${drift} 30s ease-in-out infinite}`
const leadCtaCls = css`font-size:20px;color:${tokens.fgSoft};margin:32px auto 0;max-width:560px`
const actionsCls = css`display:flex;gap:14px;justify-content:center;margin-top:40px;flex-wrap:wrap`

export default function FinalCTA() {
  const { t } = useTranslation()
  return (
    <section className={sectionCtaBelowFoldCls}>
      <div className={`${ctaCls} ${panelCls} ${fadeInCls}`}>
        <div className={blobWrap} aria-hidden="true"><div className={blob1} /><div className={blob2} /></div>
        <div style={{ position: 'relative' }}>
          <h2 className={headingCtaCls}>{t('landing.cta.headingPre')}<span className={accentCyanCls}>{t('landing.cta.headingAccent')}</span>{t('landing.cta.headingPost')}</h2>
          <p className={leadCtaCls}>{t('landing.cta.lead')}</p>
          <div className={actionsCls}>
            <Link to="/register" className={btnDarkXlCls}>{t('landing.cta.btn')} →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

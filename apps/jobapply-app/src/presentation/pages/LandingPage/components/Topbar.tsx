import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { topbarCls, topbarBarCls, btnDarkMdCls, tokens } from '../LandingPage.styles'

const brandCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:900;letter-spacing:-.02em;font-size:20px;color:${tokens.ink}`
const navCls = css`display:flex;gap:28px;font-size:14px;color:rgba(10,10,18,.65);@media (max-width:640px){display:none}`
const linkCls = css`white-space:nowrap;cursor:pointer;&:hover{opacity:.7}`

export default function Topbar() {
  const { t } = useTranslation()
  return (
    <div className={topbarCls}>
      <nav className={topbarBarCls}>
        <span className={brandCls}>dojob</span>
        <div className={navCls}>
          <a href="#como-funciona" className={linkCls}>{t('landing.nav.howItWorks')}</a>
          <a href="#recursos" className={linkCls}>{t('landing.nav.atsScore')}</a>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <Link to="/login" className={linkCls} style={{ fontSize: 14 }}>{t('landing.nav.login')}</Link>
          <Link to="/register" className={btnDarkMdCls}>{t('landing.nav.tryFree')}</Link>
        </div>
      </nav>
    </div>
  )
}

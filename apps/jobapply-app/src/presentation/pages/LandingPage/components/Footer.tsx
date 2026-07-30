import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { tokens } from '../LandingPage.styles'

const footerCls = css`position:relative;z-index:5;max-width:1440px;margin:0 auto;padding:40px 48px 60px;border-top:1px solid ${tokens.line};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px`
const leftCls = css`display:flex;align-items:center;gap:14px`
const brandCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:900;font-size:16px;color:${tokens.ink}`
const copyCls = css`font-size:12px;color:rgba(10,10,18,.4)`
const linksCls = css`display:flex;gap:24px;font-size:13px;color:rgba(10,10,18,.55)`
const linkCls = css`cursor:pointer;&:hover{opacity:.7}`

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className={footerCls}>
      <div className={leftCls}>
        <span className={brandCls}>dojob</span>
        <span className={copyCls}>{t('landing.footer.copy')}</span>
      </div>
      <div className={linksCls}>
        <a className={linkCls}>{t('landing.footer.about')}</a>
        <a className={linkCls}>{t('landing.footer.blog')}</a>
        <a className={linkCls}>{t('landing.footer.privacy')}</a>
        <a className={linkCls}>{t('landing.footer.terms')}</a>
        <a className={linkCls}>{t('landing.footer.support')}</a>
      </div>
    </footer>
  )
}

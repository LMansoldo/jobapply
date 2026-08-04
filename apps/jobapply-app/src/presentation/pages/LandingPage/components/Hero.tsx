import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { sectionHeroCls, displayCls, accentCls, leadCls, btnDarkLgCls, btnGhostLgCls, heroFadeInCls, tokens } from '../LandingPage.styles'
import AppScreenshot from './AppScreenshot'

const subCls = css`display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:48px;flex-wrap:wrap`
const actionsCls = css`display:flex;gap:14px;align-items:center`
const hlCls = css`color:${tokens.ink};font-weight:700`
const shotCls = css`margin-top:80px;position:relative`

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className={sectionHeroCls}>
      <h1 className={`${displayCls} ${heroFadeInCls}`}>
        {t('landing.hero.title1')}<br />{t('landing.hero.title2')}<br />
        {t('landing.hero.title3')} <span className={accentCls}>{t('landing.hero.titleAccent')}</span>.
      </h1>
      <div className={`${subCls} ${heroFadeInCls}`}>
        <p className={leadCls}>
          {t('landing.hero.leadPre')}<span className={hlCls}>{t('landing.hero.leadHl')}</span>{t('landing.hero.leadPost')}
        </p>
        <div className={actionsCls}>
          <Link to="/register" className={btnDarkLgCls}>{t('landing.hero.ctaMain')} →</Link>
          <a href="#como-funciona" className={btnGhostLgCls}>{t('landing.hero.ctaSec')}</a>
        </div>
      </div>
      <div className={`${shotCls} ${heroFadeInCls}`}>
        <AppScreenshot />
      </div>
    </section>
  )
}

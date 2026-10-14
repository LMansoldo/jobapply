import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { tokens } from '../LandingPage.styles'

const FooterRoot = styled.footer`position:relative;z-index:5;max-width:1440px;margin:0 auto;padding:40px 48px 60px;border-top:1px solid ${tokens.line};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px`
const Left = styled.div`display:flex;align-items:center;gap:14px`
const Brand = styled.span`font-family:'Lato','Verdana',sans-serif;font-weight:900;font-size:16px;color:${tokens.ink}`
const Copy = styled.span`font-size:12px;color:rgba(10,10,18,.4)`
const Links = styled.div`display:flex;gap:24px;font-size:13px;color:rgba(10,10,18,.55)`
const Link = styled.a`cursor:pointer;&:hover{opacity:.7}`

export default function Footer() {
  const { t } = useTranslation()
  return (
    <FooterRoot>
      <Left>
        <Brand>dojob</Brand>
        <Copy>{t('landing.footer.copy')}</Copy>
      </Left>
      <Links>
        <Link>{t('landing.footer.about')}</Link>
        <Link>{t('landing.footer.blog')}</Link>
        <Link>{t('landing.footer.privacy')}</Link>
        <Link>{t('landing.footer.terms')}</Link>
        <Link>{t('landing.footer.support')}</Link>
      </Links>
    </FooterRoot>
  )
}

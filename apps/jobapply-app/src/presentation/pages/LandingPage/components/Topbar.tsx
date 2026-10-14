import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { TopbarRoot, TopbarBar, BtnDarkMd, tokens } from '../LandingPage.styles'
import { Link, TopbarActions, LoginLink } from './Topbar.styles'

const Brand = styled.span`font-family:'Lato','Verdana',sans-serif;font-weight:900;letter-spacing:-.02em;font-size:20px`
const BrandDo = styled.span`color:${tokens.ink}`
const BrandJob = styled.span`color:${tokens.brand}`
const Nav = styled.div`display:flex;gap:28px;font-size:14px;@media (max-width:640px){display:none}`

export default function Topbar() {
  const { t } = useTranslation()
  return (
    <TopbarRoot>
      <TopbarBar>
        <Brand><BrandDo>do</BrandDo><BrandJob>job</BrandJob></Brand>
        <Nav>
          <Link href="#como-funciona">{t('landing.nav.howItWorks')}</Link>
          <Link href="#recursos">{t('landing.nav.atsScore')}</Link>
        </Nav>
        <TopbarActions>
          <LoginLink href="/login">{t('landing.nav.login')}</LoginLink>
          <BtnDarkMd href="/register">{t('landing.nav.tryFree')}</BtnDarkMd>
        </TopbarActions>
      </TopbarBar>
    </TopbarRoot>
  )
}

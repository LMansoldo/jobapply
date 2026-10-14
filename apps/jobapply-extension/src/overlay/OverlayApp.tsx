import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Global, css } from '@emotion/react'
import { FileSearchOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { AUTH_EXPIRED_EVENT } from '../shared/api'
import { CLOSE_OVERLAY } from '../shared/messages'
import { loadAuth, removeAuth, type AuthState } from '../state/auth'
import {
  Centered,
  CloseButton,
  BottomNav,
  BottomNavItem,
  Header,
  HeaderActions,
  HeaderBrand,
  Logo,
  LogoBoard,
  LogoJob,
  MainContent,
  Nav,
  NavButton,
  NavIcon,
  Right,
  Shell,
  UserAccount,
  UserAvatar,
  UserName,
} from './overlay.styles'
import { AtsScreen } from './screens/AtsScreen'
import { CvScreen } from './screens/CvScreen'
import { LoginScreen } from './screens/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen'

type View = 'login' | 'register' | 'ats' | 'cv'

const globalStyles = css`
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`

export function OverlayApp() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [booted, setBooted] = useState(false)
  const [view, setView] = useState<View>('login')
  const { t } = useTranslation()

  useEffect(() => {
    loadAuth().then((stored) => {
      if (stored) {
        setAuth(stored)
        setView('ats')
      }
      setBooted(true)
    })
  }, [])

  useEffect(() => {
    const onExpired = () => {
      setAuth(null)
      setView('login')
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
  }, [])

  const handleLogin = async (token: string, user: AuthState['user']) => {
    await import('../state/auth').then(({ persistAuth }) => persistAuth(token, user))
    setAuth({ token, user, authAt: Date.now() })
    setView('ats')
  }

  const handleLogout = () => {
    void removeAuth()
    setAuth(null)
    setView('login')
  }

  const handleClose = () => {
    if (window.self === window.top) {
      window.close()
      return
    }
    void chrome.runtime.sendMessage({ type: CLOSE_OVERLAY })
  }

  const body = (() => {
    if (!booted) {
      return (
        <Centered>
          <Spin />
        </Centered>
      )
    }
    if (!auth) {
      return view === 'register' ? (
        <RegisterScreen onRegistered={() => setView('login')} onBackToLogin={() => setView('login')} />
      ) : (
        <LoginScreen onLogin={handleLogin} onGoToRegister={() => setView('register')} />
      )
    }
    return (
      <Shell>
        <Header>
          <HeaderBrand>
            <Logo type="button" onClick={() => setView('ats')} aria-label={t('app.name')}>
              <LogoJob>do</LogoJob>
              <LogoBoard>job</LogoBoard>
            </Logo>
          </HeaderBrand>
          <Nav>
            <NavButton type="button" $active={view === 'ats'} onClick={() => setView('ats')}>
              <NavIcon><FileSearchOutlined /></NavIcon>{t('extension.tailoringNav')}
            </NavButton>
            <NavButton type="button" $active={view === 'cv'} onClick={() => setView('cv')}>
              <NavIcon><UserOutlined /></NavIcon>{t('extension.profileNav')}
            </NavButton>
          </Nav>
          <Right>
            <UserAccount type="button" onClick={handleLogout} aria-label={t('auth.logout')}>
              <UserAvatar><UserOutlined /></UserAvatar>
              <UserName>{auth.user.name || auth.user.email}</UserName>
            </UserAccount>
            <HeaderActions>
              <CloseButton onClick={handleClose} aria-label={t('extension.close')}>
                ×
              </CloseButton>
            </HeaderActions>
          </Right>
        </Header>
        <MainContent>
          {view === 'cv' ? (
            <CvScreen auth={auth} onBack={() => setView('ats')} onSaved={() => setView('ats')} />
          ) : (
            <AtsScreen auth={auth} onOpenCv={() => setView('cv')} />
          )}
        </MainContent>
        <BottomNav>
          <BottomNavItem type="button" $active={view === 'ats'} onClick={() => setView('ats')}>
            <FileSearchOutlined />
            <span>{t('extension.tailoringNav')}</span>
          </BottomNavItem>
          <BottomNavItem type="button" $active={view === 'cv'} onClick={() => setView('cv')}>
            <UserOutlined />
            <span>{t('extension.profileNav')}</span>
          </BottomNavItem>
          <BottomNavItem type="button" $active={false} onClick={handleLogout}>
            <LogoutOutlined />
            <span>{t('auth.logout')}</span>
          </BottomNavItem>
        </BottomNav>
      </Shell>
    )
  })()

  return (
    <>
      <Global styles={globalStyles} />
      {body}
    </>
  )
}

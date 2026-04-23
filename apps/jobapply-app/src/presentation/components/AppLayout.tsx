import { Grid } from 'antd'
import {
  ToolOutlined,
  FileSearchOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, useRouterState, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../components/Avatar'
import { Dropdown } from '../../components/Dropdown'
import { AppContent } from '../../components/Layout'
import { Space } from '../../components/Space'
import { AppHeader as DSAppHeader } from '../../design-system/layout/AppHeader'
import { useAuth } from '../../application/providers/AuthProvider'
import * as styles from './AppLayout.styles'

const MOBILE_NAV_KEYS = ['jobs', 'tailoring', 'profile']

const { useBreakpoint } = Grid

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { pathname } = location
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { t } = useTranslation()

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ]

  const navItems = [
    {
      key: 'jobs',
      label: t('nav.jobs'),
      icon: <ToolOutlined />,
      href: '/',
      active: pathname === '/',
    },
    {
      key: 'tailoring',
      label: t('nav.tailoring'),
      icon: <FileSearchOutlined />,
      href: '/tailoring',
      active: pathname === '/tailoring',
    },
    {
      key: 'profile',
      label: t('nav.profile'),
      icon: <UserOutlined />,
      href: '/cv',
      active: pathname === '/cv' || pathname.startsWith('/tailoring/'),
    },
  ]

  const rightSlot = (
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
      <styles.UserSpace size={8}>
        <styles.UserAvatar icon={<UserOutlined />} size={isMobile ? 28 : 32} />
        {!isMobile && (
          <styles.UserName>{user?.name ?? t('nav.user')}</styles.UserName>
        )}
      </styles.UserSpace>
    </Dropdown>
  )

  const mobileNavItems = navItems.filter((item) => MOBILE_NAV_KEYS.includes(item.key))

  return (
    <div className={styles.pageRoot}>
      <DSAppHeader
        navItems={isMobile ? [] : navItems}
        rightSlot={rightSlot}
      />
      <styles.AppContentStyled isMobile={isMobile}>
        <Outlet />
      </styles.AppContentStyled>
      {isMobile && (
        <styles.BottomNav>
          {mobileNavItems.map((item) => (
            <styles.BottomNavItem
              key={item.key}
              active={item.active}
              type="button"
              onClick={() => item.href && item.href !== '#' && navigate({ to: item.href as '/' })}
            >
              {item.icon}
              <span>{item.label}</span>
            </styles.BottomNavItem>
          ))}
          <styles.BottomNavItem
            active={false}
            type="button"
            onClick={handleLogout}
          >
            <LogoutOutlined />
            <span>{t('auth.logout')}</span>
          </styles.BottomNavItem>
        </styles.BottomNav>
      )}
    </div>
  )
}

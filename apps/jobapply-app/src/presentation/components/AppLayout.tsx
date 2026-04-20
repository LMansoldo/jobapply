import { Grid } from 'antd'
import {
  ToolOutlined,
  BankOutlined,
  LineChartOutlined,
  BellOutlined,
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
      key: 'companies',
      label: t('nav.companies'),
      icon: <BankOutlined />,
      href: '#',
      active: false,
    },
    {
      key: 'salaries',
      label: t('nav.salaries'),
      icon: <LineChartOutlined />,
      href: '#',
      active: false,
    },
    {
      key: 'tailoring',
      label: t('nav.tailoring'),
      icon: <FileSearchOutlined />,
      href: '/tailoring',
      active: pathname === '/tailoring',
    },
    {
      key: 'alerts',
      label: t('nav.alerts'),
      icon: <BellOutlined />,
      href: '#',
      active: false,
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

  return (
    <div className={styles.pageRoot}>
      <DSAppHeader
        navItems={isMobile ? [] : navItems}
        rightSlot={rightSlot}
      />
      <styles.AppContentStyled isMobile={isMobile}>
        <Outlet />
      </styles.AppContentStyled>
    </div>
  )
}

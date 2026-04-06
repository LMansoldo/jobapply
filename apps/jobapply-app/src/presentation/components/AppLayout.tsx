import { Grid } from 'antd'
import {
  UnorderedListOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../components/Avatar'
import { Dropdown } from '../../components/Dropdown'
import { AppLayout as Layout, AppHeader, AppContent } from '../../components/Layout'
import { Space } from '../../components/Space'
import { Text } from '../../components/Typography'
import { useAuth } from '../../application/providers/AuthProvider'
import { Colors } from '../../styles/theme/colors'
import { FontSize } from '../../styles/theme/typography'
import { Spacing } from '../../styles/theme/spacing'

const { useBreakpoint } = Grid

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { t } = useTranslation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: '/',
      icon: <UnorderedListOutlined />,
      label: t('nav.jobs'),
      onClick: () => navigate('/'),
      style: pathname === '/' ? { color: Colors.info, fontWeight: 600 } : undefined,
    },
    {
      key: '/cv',
      icon: <FileTextOutlined />,
      label: t('nav.cv'),
      onClick: () => navigate('/cv'),
      style: pathname === '/cv' ? { color: Colors.info, fontWeight: 600 } : undefined,
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? `0 ${Spacing.md}` : `0 ${Spacing.lg}`,
          background: Colors.white,
          boxShadow: `0 ${Spacing.px} ${Spacing.sm2} ${Colors.shadowSm}`,
          height: Spacing.headerHeight,
        }}
      >
        <Text
          strong
          style={{
            color: Colors.secondary,
            fontSize: isMobile ? FontSize.base : FontSize.xl,
            letterSpacing: 1,
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          JobApply
        </Text>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space style={{ cursor: 'pointer' }} size={8}>
            <Avatar icon={<UserOutlined />} style={{ background: Colors.primary }} size={isMobile ? 28 : 32} />
            {!isMobile && (
              <Text style={{ color: Colors.textBase, fontSize: FontSize.md }}>{user?.name ?? t('nav.user')}</Text>
            )}
          </Space>
        </Dropdown>
      </AppHeader>

      <AppContent
        style={{
          padding: isMobile ? Spacing.md1 : Spacing.lg,
          minHeight: `calc(100vh - ${Spacing.headerHeight})`,
        }}
      >
        <Outlet />
      </AppContent>
    </Layout>
  )
}

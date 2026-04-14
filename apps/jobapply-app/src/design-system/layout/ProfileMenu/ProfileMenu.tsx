/**
 * Container: owns dropdown open state and wires auth actions to the panel.
 */
import { Dropdown } from '../../../components/Dropdown'
import { UserOutlined } from '@ant-design/icons'
import { ProfileMenuPanel } from './ProfileMenu.panel'
import { DEMO_ALERTS, totalAlertCount } from './helpers'
import type { ProfileMenuProps } from './ProfileMenu.types'
import * as styles from './ProfileMenu.styles'

export function ProfileMenu({
  user,
  alerts = DEMO_ALERTS,
  isMobile = false,
  onLogout,
  onViewProfile,
}: ProfileMenuProps) {
  const count = totalAlertCount(alerts)

  const panel = (
    <ProfileMenuPanel
      user={user}
      alerts={alerts}
      completionPercent={72}
      onLogout={onLogout}
      onViewProfile={onViewProfile}
    />
  )

  return (
    <Dropdown popupRender={() => panel} trigger={['click']} placement="bottomRight">
      <div className={styles.trigger}>
        <div className={styles.avatarWrapper}>
          <styles.PrimaryAvatar
            icon={<UserOutlined />}
            size={isMobile ? 28 : 32}
          />
          {count > 0 && (
            <span className={styles.alertBubble}>
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
        {!isMobile && (
          <span className={styles.triggerName}>{user.name}</span>
        )}
      </div>
    </Dropdown>
  )
}

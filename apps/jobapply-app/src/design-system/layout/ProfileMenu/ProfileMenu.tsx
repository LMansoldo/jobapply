/**
 * Container: owns dropdown open state and wires auth actions to the panel.
 */
import { Dropdown } from '../../../components/Dropdown'
import { UserOutlined } from '@ant-design/icons'
import { ProfileMenuPanel } from './ProfileMenu.panel'
import type { ProfileMenuProps } from './ProfileMenu.types'
import * as styles from './ProfileMenu.styles'

export function ProfileMenu({
  user,
  isMobile = false,
  onLogout,
  onViewProfile,
}: ProfileMenuProps) {
  const panel = (
    <ProfileMenuPanel
      user={user}
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
        </div>
        {!isMobile && (
          <span className={styles.triggerName}>{user.name}</span>
        )}
      </div>
    </Dropdown>
  )
}

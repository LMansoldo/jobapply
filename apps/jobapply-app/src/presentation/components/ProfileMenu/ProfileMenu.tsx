/**
 * Container: owns dropdown open state and wires auth actions to the panel.
 */
import { Dropdown } from '../../../design-system/wrappers/Dropdown'
import { UserOutlined } from '@ant-design/icons'
import { ProfileMenuPanel } from './ProfileMenu.panel'
import type { ProfileMenuProps } from './ProfileMenu.types'
import { Trigger, AvatarWrapper, PrimaryAvatar, TriggerName } from './ProfileMenu.styles'

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
      <Trigger>
        <AvatarWrapper>
          <PrimaryAvatar
            icon={<UserOutlined />}
            size={isMobile ? 28 : 32}
          />
        </AvatarWrapper>
        {!isMobile && (
          <TriggerName>{user.name}</TriggerName>
        )}
      </Trigger>
    </Dropdown>
  )
}

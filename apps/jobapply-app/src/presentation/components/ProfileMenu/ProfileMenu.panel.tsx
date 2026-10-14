/**
 * Presentational: the content rendered inside the AntD dropdown.
 * Pure component — no hooks, no side effects.
 */
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ProgressBar } from '@jobapply/ui'
import type { ProfileMenuPanelProps } from './ProfileMenu.types'
import { getInitials } from './helpers'
import {
  Panel,
  ProfileSection,
  PanelAvatar,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  ProgressRow,
  ProgressLabel,
  ProgressLabelText,
  ProgressLabelValue,
  ViewProfileBtn,
  Footer,
  FooterItem,
} from './ProfileMenu.styles'

export function ProfileMenuPanel({
  user,
  completionPercent,
  onLogout,
  onViewProfile,
  renderFooter,
}: ProfileMenuPanelProps) {
  const { t } = useTranslation()
  const initials = getInitials(user.name)

  return (
    <Panel>
      {/* Profile section */}
      <ProfileSection>
        <PanelAvatar>{initials}</PanelAvatar>
        <ProfileInfo>
          <ProfileName>{user.name}</ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
        </ProfileInfo>
      </ProfileSection>

      {/* Completion progress */}
      <ProgressRow>
        <ProgressLabel>
          <ProgressLabelText>{t('profile.completion')}</ProgressLabelText>
          <ProgressLabelValue>{completionPercent}%</ProgressLabelValue>
        </ProgressLabel>
        <ProgressBar value={completionPercent} />
        {onViewProfile && (
          <ViewProfileBtn type="button" onClick={onViewProfile}>
            {t('profile.viewProfile')}
          </ViewProfileBtn>
        )}
      </ProgressRow>

      {/* Render prop slot — e.g. custom actions */}
      {renderFooter?.()}

      {/* Footer actions */}
      <Footer>
        <FooterItem onClick={onViewProfile} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onViewProfile?.()}>
          <UserOutlined />
          {t('nav.cv')}
        </FooterItem>
        <FooterItem $danger onClick={onLogout} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onLogout()}>
          <LogoutOutlined />
          {t('auth.logout')}
        </FooterItem>
      </Footer>
    </Panel>
  )
}

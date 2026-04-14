/**
 * Presentational: the content rendered inside the AntD dropdown.
 * Pure component — no hooks, no side effects.
 */
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ProgressBar } from '../../primitives/ProgressBar'
import type { ProfileMenuPanelProps } from './ProfileMenu.types'
import { getInitials } from './helpers'
import * as styles from './ProfileMenu.styles'

export function ProfileMenuPanel({
  user,
  alerts,
  completionPercent,
  onLogout,
  onViewProfile,
  renderFooter,
}: ProfileMenuPanelProps) {
  const { t } = useTranslation()
  const initials = getInitials(user.name)

  return (
    <div className={styles.panel}>
      {/* Profile section */}
      <div className={styles.profileSection}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.profileInfo}>
          <p className={styles.profileName}>{user.name}</p>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>
      </div>

      {/* Completion progress */}
      <div className={styles.progressRow}>
        <div className={styles.progressLabel}>
          <span className={styles.progressLabelText}>{t('profile.completion')}</span>
          <span className={styles.progressLabelValue}>{completionPercent}%</span>
        </div>
        <ProgressBar value={completionPercent} />
        {onViewProfile && (
          <button type="button" className={styles.viewProfileBtn} onClick={onViewProfile}>
            {t('profile.viewProfile')}
          </button>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>{t('jobs.alerts')}</p>
          </div>
          {alerts.map((alert) => (
            <div key={alert.title} className={styles.alertItem}>
              <div className={styles.alertIcon}>{alert.icon}</div>
              <div className={styles.alertContent}>
                <p className={styles.alertTitle}>{alert.title}</p>
              </div>
              <span className={styles.alertBadge}>{alert.count}</span>
            </div>
          ))}
        </>
      )}

      {/* Render prop slot — e.g. custom actions */}
      {renderFooter?.()}

      {/* Footer actions */}
      <div className={styles.footer}>
        <div className={styles.footerItem(false)} onClick={onViewProfile} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onViewProfile?.()}>
          <UserOutlined />
          {t('nav.cv')}
        </div>
        <div className={styles.footerItem(true)} onClick={onLogout} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onLogout()}>
          <LogoutOutlined />
          {t('auth.logout')}
        </div>
      </div>
    </div>
  )
}

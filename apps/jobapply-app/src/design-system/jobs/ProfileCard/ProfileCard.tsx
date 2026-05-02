import { useTranslation } from 'react-i18next'
import { ProgressBar } from '../../primitives/ProgressBar'
import type { ProfileCardProps } from './ProfileCard.types'
import { styles } from './ProfileCard.styles'

export function ProfileCard({ user, completionPercent }: ProfileCardProps) {
  const { t } = useTranslation()
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div style={styles.card}>
      <div style={styles.banner} />
      <div style={styles.body}>
        <div style={styles.avatarWrapper}>
          <div style={styles.avatar}>{initials}</div>
        </div>
        <p style={styles.name}>{user.name}</p>
        <span style={styles.email}>{user.email}</span>
        <div style={styles.progressLabel}>
          <span style={styles.progressLabelText}>{t('profile.completion')}</span>
          <span style={styles.progressLabelValue}>{completionPercent}%</span>
        </div>
        <ProgressBar value={completionPercent} />
      </div>
    </div>
  )
}

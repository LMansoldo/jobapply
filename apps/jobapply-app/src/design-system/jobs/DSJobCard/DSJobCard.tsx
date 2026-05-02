import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EnvironmentOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { Colors } from '../../../styles/theme/colors'
import { SkillTag } from '../../primitives/SkillTag'
import { Badge } from '../../primitives/Badge'
import { BookmarkBtn } from '../BookmarkBtn'
import type { DSJobCardProps } from './DSJobCard.types'
import * as styles from './DSJobCard.styles'

export function DSJobCard({
  job,
  variant = 'default',
  isSelected = false,
  companyColor,
  index = 0,
  onClick,
  onDismiss,
}: DSJobCardProps) {
  const { t } = useTranslation()
  const [saved, setSaved] = useState(false)

  const isFeatured = variant === 'featured'
  const accentColor = companyColor ?? Colors.primaryDark
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <div
      className={styles.card(isSelected, index)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {isFeatured && <div className={styles.cardFeaturedAccent} />}

      <div className={styles.top}>
        <div className={styles.coMark(accentColor)}>{initials}</div>
        <div className={styles.titleGroup}>
          <p className={styles.title}>{job.title}</p>
          <span className={styles.company}>{job.company}</span>
        </div>
        <BookmarkBtn saved={saved} onToggle={() => setSaved((s) => !s)} />
      </div>

      <div className={styles.meta}>
        {job.location && (
          <span className={styles.metaText}>
            <EnvironmentOutlined />
            {job.location}
          </span>
        )}
        <span className={styles.metaText}>
          <ClockCircleOutlined />
          {new Date(job.createdAt).toLocaleDateString('pt-BR')}
        </span>
        {job.status === 'open' && <Badge variant="new">{t('jobs.statusOpen')}</Badge>}
      </div>

      {job.tags.length > 0 && (
        <div className={styles.tags}>
          {job.tags.slice(0, 4).map((tag) => (
            <SkillTag key={tag} color="purple">{tag}</SkillTag>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        {job.salary && <span className={styles.salary}>{job.salary}</span>}
      </div>

      {onDismiss && (
        <button
          type="button"
          className={styles.dismissBtn}
          onClick={(e) => { e.stopPropagation(); onDismiss(job._id) }}
          aria-label="Dispensar vaga"
        >
          <CloseOutlined />
        </button>
      )}
    </div>
  )
}

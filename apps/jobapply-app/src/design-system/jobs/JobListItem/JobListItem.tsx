import { CloseOutlined, FireOutlined } from '@ant-design/icons'
import { CompanyLogo } from '../CompanyLogo'
import type { JobListItemProps } from './JobListItem.types'
import * as styles from './JobListItem.styles'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `Há ${days} dias`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  return `Há ${months} ${months > 1 ? 'meses' : 'mês'}`
}

export function JobListItem({ job, isSelected, isViewed, isHot, onClick, onDismiss }: JobListItemProps) {
  return (
    <div
      className={styles.item(!!isSelected)}
      onClick={() => onClick?.(job)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(job)}
    >
      <div className={styles.logoWrap}>
        <CompanyLogo name={job.company} size={40} />
      </div>

      <div className={styles.content}>
        <p className={styles.title(!!isSelected)}>{job.title}</p>
        <p className={styles.company}>{job.company}</p>
        {job.location && <p className={styles.location}>{job.location}</p>}

        <div className={styles.meta}>
          <span className={styles.timeLabel}>{timeAgo(job.createdAt)}</span>
          {isHot && (
            <span className={styles.hotBadge}>
              <FireOutlined /> Em alta
            </span>
          )}
          {job.status === 'applied' && (
            <span className={styles.newBadge}>Candidatado</span>
          )}
          {isViewed && (
            <span className={styles.viewedLabel}>· Visualizado</span>
          )}
        </div>
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

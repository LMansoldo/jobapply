import type { JobContextBarProps } from './JobContextBar.types'
import { styles } from './JobContextBar.styles'

export function JobContextBar({ job, lang }: JobContextBarProps) {
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div style={styles.jobInfo}>
      <div style={styles.logo}>{initials}</div>
      <div>
        <div style={styles.title}>{job.title}</div>
        <div style={styles.sub}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
      </div>
      <span style={styles.langBadge}>{lang === 'pt-BR' ? 'PT-BR' : 'EN'}</span>
    </div>
  )
}

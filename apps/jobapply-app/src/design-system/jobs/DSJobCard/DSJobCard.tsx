import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Shadows } from '../../../styles/theme/shadows'
import { CompanyLogo } from '../CompanyLogo'
import { SkillTag } from '../../primitives/SkillTag'
import { Badge } from '../../primitives/Badge'
import { BookmarkBtn } from '../BookmarkBtn'
import type { DSJobCardProps } from './DSJobCard.types'
import { styles } from './DSJobCard.styles'

export function DSJobCard({ job, variant = 'default', isSelected, onClick }: DSJobCardProps) {
  const { t } = useTranslation()
  const [saved, setSaved] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isFeatured = variant === 'featured'

  return (
    <div
      style={{
        ...styles.card,
        ...(isSelected ? styles.cardSelected : {}),
        boxShadow: hovered || isSelected ? Shadows.md : Shadows.sm,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {isFeatured && <div style={styles.cardFeaturedAccent} />}

      <div style={styles.top}>
        <CompanyLogo name={job.company} size={44} />
        <div style={styles.titleGroup}>
          <p style={styles.title}>{job.title}</p>
          <span style={styles.company}>{job.company}</span>
        </div>
        <BookmarkBtn saved={saved} onToggle={() => setSaved((s) => !s)} />
      </div>

      <div style={styles.meta}>
        {job.location && (
          <span style={styles.metaText}>
            <EnvironmentOutlined />
            {job.location}
          </span>
        )}
        <span style={styles.metaText}>
          <ClockCircleOutlined />
          {new Date(job.createdAt).toLocaleDateString('pt-BR')}
        </span>
        {job.status === 'open' && <Badge variant="new">{t('jobs.statusOpen')}</Badge>}
      </div>

      {job.tags.length > 0 && (
        <div style={styles.tags}>
          {job.tags.slice(0, 4).map((tag) => (
            <SkillTag key={tag} color="purple">
              {tag}
            </SkillTag>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        {job.salary && <span style={styles.salary}>{job.salary}</span>}
      </div>
    </div>
  )
}

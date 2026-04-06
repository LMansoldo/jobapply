/**
 * @file JobFilterBar.tsx
 * @description JobFilterBar component — search and filter controls for the jobs list.
 */
import { useState } from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { JobFilterBarProps } from './JobFilterBar.types'
import { FilterPanel } from '../../../../design-system/jobs/FilterPanel'
import { FilterCheckbox } from '../../../../design-system/jobs/FilterCheckbox'
import { FilterTagCloud } from '../../../../design-system/jobs/FilterTagCloud'
import { DSInput } from '../../../../design-system/primitives/DSInput'
import { DSCard } from '../../../../design-system/primitives/DSCard'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { Colors } from '../../../../styles/theme/colors'
import { FontWeight } from '../../../../styles/theme/typography'

const STATUS_OPTIONS = [
  { key: 'open', i18nKey: 'jobs.open' },
  { key: 'applied', i18nKey: 'jobs.applied' },
  { key: 'closed', i18nKey: 'jobs.closed' },
]

/**
 * Filter panel for the jobs list page.
 * @param props - JobFilterBarProps
 */
export function JobFilterBar({ onFilterChange, onReload }: JobFilterBarProps) {
  const { t } = useTranslation()
  const [statuses, setStatuses] = useState<Record<string, boolean>>({ open: true })
  const [tags, setTags] = useState([
    { label: 'React', active: false },
    { label: 'TypeScript', active: false },
    { label: 'Node.js', active: false },
    { label: 'Python', active: false },
    { label: 'Java', active: false },
    { label: 'AWS', active: false },
  ])

  const handleStatusChange = (key: string, checked: boolean) => {
    const updated = { ...statuses, [key]: checked }
    setStatuses(updated)
    const active = Object.entries(updated)
      .filter(([, v]) => v)
      .map(([k]) => k)
    onFilterChange('status', active[0] ?? '')
  }

  const handleTagChange = (label: string, active: boolean) => {
    setTags((prev) => prev.map((t) => (t.label === label ? { ...t, active } : t)))
    onFilterChange('tags', label)
  }

  return (
    <FilterPanel>
      {/* Search */}
      <DSInput
        filled
        placeholder={t('jobs.search')}
        onChange={(e) => onFilterChange('title', e.target.value)}
      />

      {/* Status filters */}
      <DSCard title={t('jobs.status')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {STATUS_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.key}
              label={t(opt.i18nKey)}
              checked={!!statuses[opt.key]}
              onChange={(checked) => handleStatusChange(opt.key, checked)}
            />
          ))}
        </div>
      </DSCard>

      {/* Technology tags */}
      <DSCard title={t('jobs.technologies')}>
        <FilterTagCloud tags={tags} onChange={handleTagChange} />
      </DSCard>

      {/* Company search + reload */}
      <DSInput
        filled
        placeholder={t('jobs.company')}
        onChange={(e) => onFilterChange('company', e.target.value)}
      />

      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          color: Colors.textSub,
          fontSize: '1.3rem',
          fontWeight: FontWeight.medium,
          cursor: 'pointer',
          padding: '4px 0',
        }}
        onClick={onReload}
      >
        <ReloadOutlined /> {t('common.reload', 'Recarregar')}
      </button>
    </FilterPanel>
  )
}

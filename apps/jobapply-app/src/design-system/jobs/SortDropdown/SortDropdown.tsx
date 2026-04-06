import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import type { SortDropdownProps, SortOption } from './SortDropdown.types'
import { Colors } from '../../../styles/theme/colors'
import { FontSize } from '../../../styles/theme/typography'

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useTranslation()

  const options: { value: SortOption; label: string }[] = [
    { value: 'relevant', label: t('jobs.sortRelevant') },
    { value: 'recent', label: t('jobs.sortRecent') },
    { value: 'salary', label: t('jobs.sortSalary') },
    { value: 'applications', label: t('jobs.sortApplications') },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: FontSize.sm, color: Colors.textSub, whiteSpace: 'nowrap' }}>
        {t('jobs.sortBy')}:
      </span>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        size="small"
        style={{ width: '16rem', fontSize: FontSize.sm }}
        variant="outlined"
      />
    </div>
  )
}

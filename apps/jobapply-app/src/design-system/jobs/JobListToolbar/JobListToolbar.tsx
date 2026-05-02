/** Presentational: list panel header with result count and sort button. */
import { FilterOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { JobListToolbarProps } from './JobListToolbar.types'
import * as styles from './JobListToolbar.styles'

export function JobListToolbar({ total, onSort }: JobListToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.toolbar}>
      <p className={styles.count}>
        <span className={styles.countAccent}>{total}</span>{' '}
        {t('jobs.jobsFound', { count: total, defaultValue: total === 1 ? 'vaga encontrada' : 'vagas encontradas' })}
      </p>
      <button type="button" className={styles.sortBtn} onClick={onSort}>
        <FilterOutlined />
        {t('common.sort', { defaultValue: 'Ordenar' })}
      </button>
    </div>
  )
}

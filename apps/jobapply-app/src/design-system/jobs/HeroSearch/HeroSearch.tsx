import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { HeroSearchProps } from './HeroSearch.types'
import { styles } from './HeroSearch.styles'

export function HeroSearch({
  keywordValue,
  locationValue,
  onKeywordChange,
  onLocationChange,
  onSearch,
}: HeroSearchProps) {
  const { t } = useTranslation()

  return (
    <div style={styles.bar}>
      <SearchOutlined style={styles.icon} />
      <div style={styles.inputWrapper}>
        <input
          style={styles.input}
          value={keywordValue}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder={t('jobs.searchPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>
      <div style={styles.divider} />
      <EnvironmentOutlined style={styles.icon} />
      <div style={styles.inputWrapper}>
        <input
          style={styles.input}
          value={locationValue}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder={t('jobs.locationPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>
      <button type="button" style={styles.btn} onClick={onSearch}>
        {t('jobs.search')}
      </button>
    </div>
  )
}

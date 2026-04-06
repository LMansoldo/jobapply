import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { HeroSectionProps } from './HeroSection.types'
import { styles } from './HeroSection.styles'

const DEFAULT_CHIPS = ['React Developer', 'Product Manager', 'UX Designer', 'Data Scientist', 'DevOps Engineer', 'Remoto']

export function HeroSection({
  keywordValue,
  locationValue,
  onKeywordChange,
  onLocationChange,
  onSearch,
  quickChips = DEFAULT_CHIPS,
  onChipClick,
}: HeroSectionProps) {
  const { t } = useTranslation()

  return (
    <div style={styles.hero}>
      <h1 style={styles.headline}>{t('jobs.searchHero')}</h1>
      <p style={styles.subtitle}>{t('jobs.searchHeroSub')}</p>

      <div style={styles.searchBar}>
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
        <button type="button" style={styles.searchBtn} onClick={onSearch}>
          {t('jobs.search')}
        </button>
      </div>

      {quickChips.length > 0 && (
        <div style={styles.chips}>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              style={styles.chip}
              onClick={() => onChipClick?.(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

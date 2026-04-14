/** Presentational: dual-field search pill (keyword + location) with Buscar button. */
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
import type { HeroSearchFormProps } from './JobsHero.types'
import * as styles from './JobsHero.styles'

export function HeroSearchForm({
  search,
  location,
  searchPlaceholder,
  locationPlaceholder,
  searchLabel,
  onSearchChange,
  onLocationChange,
  onSubmit,
}: HeroSearchFormProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <form
      className={styles.searchForm}
      onSubmit={(e) => { e.preventDefault(); onSubmit() }}
    >
      <div className={styles.inputSection}>
        <SearchOutlined className={styles.inputIcon} />
        <input
          className={styles.inputNative}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className={styles.formDivider} />

      <div className={styles.inputSection}>
        <EnvironmentOutlined className={styles.inputIcon} />
        <input
          className={styles.inputNative}
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={locationPlaceholder}
        />
      </div>

      <button type="submit" className={styles.searchBtn}>
        {searchLabel}
      </button>
    </form>
  )
}

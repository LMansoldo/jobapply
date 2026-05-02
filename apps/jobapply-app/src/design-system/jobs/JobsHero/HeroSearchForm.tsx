/** Presentational: single-field search pill (keyword only) with Buscar button. */
import { SearchOutlined } from '@ant-design/icons'
import type { HeroSearchFormProps } from './JobsHero.types'
import * as styles from './JobsHero.styles'

export function HeroSearchForm({
  search,
  searchPlaceholder,
  searchLabel,
  searchIcon,
  onSearchChange,
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
        <span className={styles.inputIcon}>
          {searchIcon ?? <SearchOutlined />}
        </span>
        <input
          className={styles.inputNative}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
        />
      </div>

      <button type="submit" className={styles.searchBtn}>
        {searchLabel}
      </button>
    </form>
  )
}

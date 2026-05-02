/** Presentational: row of quick-search shortcut chips. */
import type { HeroQuickChipsProps } from './JobsHero.types'
import * as styles from './JobsHero.styles'

export function HeroQuickChips({ chips, onChipClick }: HeroQuickChipsProps) {
  return (
    <div className={styles.chipsRow}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className={styles.chip}
          onClick={() => onChipClick(chip.label)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}

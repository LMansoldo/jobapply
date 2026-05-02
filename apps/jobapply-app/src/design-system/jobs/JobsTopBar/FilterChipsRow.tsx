/**
 * Presentational: renders a row of filter chips using a render prop.
 * The parent decides how each chip looks — this component only handles layout.
 */
import type { FilterChipsRowProps } from './JobsTopBar.types'
import * as styles from './JobsTopBar.styles'

export function FilterChipsRow({ chips, active, renderChip }: FilterChipsRowProps) {
  return (
    <div className={styles.chipsGroup}>
      {chips.map((chip) => renderChip(chip, active.includes(chip.key)))}
    </div>
  )
}

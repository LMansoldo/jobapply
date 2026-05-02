import type { FilterPanelProps } from './FilterPanel.types'
import { styles } from './FilterPanel.styles'

export function FilterPanel({ children }: FilterPanelProps) {
  return <div style={styles.panel}>{children}</div>
}

import { CheckOutlined } from '@ant-design/icons'
import type { FilterCheckboxProps } from './FilterCheckbox.types'
import { styles } from './FilterCheckbox.styles'

export function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <div
      style={styles.row}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => e.key === ' ' && onChange(!checked)}
    >
      <div style={{ ...styles.checkbox, ...(checked ? styles.checkboxChecked : {}) }}>
        {checked && <CheckOutlined style={styles.checkmark} />}
      </div>
      <span style={styles.label}>{label}</span>
      {count !== undefined && <span style={styles.count}>{count}</span>}
    </div>
  )
}

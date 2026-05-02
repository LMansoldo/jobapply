import type { ToneChipsProps } from './ToneChips.types'
import { styles } from './ToneChips.styles'

export function ToneChips({ options, value, onChange }: ToneChipsProps) {
  return (
    <div style={styles.group}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          style={{
            ...styles.chip,
            ...(option.key === value ? styles.chipActive : {}),
          }}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

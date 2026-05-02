import type { PasswordStrengthProps } from './PasswordStrength.types'
import { styles, strengthColors, strengthLabels } from './PasswordStrength.styles'

export function PasswordStrength({ value }: PasswordStrengthProps) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            style={{
              ...styles.bar,
              background: value >= level ? strengthColors[value] : undefined,
            }}
          />
        ))}
      </div>
      {value > 0 && (
        <span style={{ ...styles.label, color: strengthColors[value] }}>
          {strengthLabels[value]}
        </span>
      )}
    </div>
  )
}

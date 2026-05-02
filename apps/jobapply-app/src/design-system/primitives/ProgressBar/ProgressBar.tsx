import type { ProgressBarProps } from './ProgressBar.types'
import { styles } from './ProgressBar.styles'

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div style={styles.wrapper}>
      {label && <span style={styles.label}>{label}</span>}
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${clamped}%` }} />
      </div>
    </div>
  )
}

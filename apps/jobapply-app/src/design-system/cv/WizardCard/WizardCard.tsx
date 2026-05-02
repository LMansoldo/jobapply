import type { WizardCardProps } from './WizardCard.types'
import { styles } from './WizardCard.styles'

export function WizardCard({ header, children }: WizardCardProps) {
  return (
    <div style={styles.card}>
      {header && <div style={styles.header}>{header}</div>}
      <div style={styles.body}>{children}</div>
    </div>
  )
}

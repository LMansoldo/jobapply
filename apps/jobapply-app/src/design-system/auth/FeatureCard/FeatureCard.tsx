import type { FeatureCardProps } from './FeatureCard.types'
import { styles } from './FeatureCard.styles'

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.iconWrapper}>{icon}</div>
      <div style={styles.textGroup}>
        <p style={styles.title}>{title}</p>
        <p style={styles.description}>{description}</p>
      </div>
    </div>
  )
}

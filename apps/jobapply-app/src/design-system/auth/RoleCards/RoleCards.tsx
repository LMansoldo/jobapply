import type { RoleCardsProps } from './RoleCards.types'
import { styles } from './RoleCards.styles'

export function RoleCards({ roles, value, onChange }: RoleCardsProps) {
  return (
    <div style={styles.grid}>
      {roles.map((role) => (
        <div
          key={role.key}
          style={{
            ...styles.card,
            ...(role.key === value ? styles.cardActive : {}),
          }}
          onClick={() => onChange(role.key)}
          role="radio"
          aria-checked={role.key === value}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onChange(role.key)}
        >
          <span style={styles.icon}>{role.icon}</span>
          <span>{role.label}</span>
        </div>
      ))}
    </div>
  )
}

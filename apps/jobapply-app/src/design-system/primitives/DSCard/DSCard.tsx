import { useState } from 'react'
import type { DSCardProps } from './DSCard.types'
import { styles } from './DSCard.styles'
import { Shadows } from '../../../styles/theme/shadows'

export function DSCard({ title, extra, children, hoverable, style, className, onClick }: DSCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={className}
      style={{
        ...styles.card,
        ...(hoverable ? styles.cardHoverable : {}),
        boxShadow: hoverable && hovered ? Shadows.md : styles.card.boxShadow,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(title || extra) && (
        <div style={styles.header}>
          {title && <span style={styles.title}>{title}</span>}
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

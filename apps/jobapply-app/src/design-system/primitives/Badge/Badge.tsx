import type { BadgeProps } from './Badge.types'
import { variantStyles } from './Badge.styles'

export function Badge({ variant = 'default', children }: BadgeProps) {
  return <span style={variantStyles[variant]}>{children}</span>
}

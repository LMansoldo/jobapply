import type { InlineBadgeProps } from './InlineBadge.types'
import { variantStyles } from './InlineBadge.styles'

export function InlineBadge({ variant = 'success', children }: InlineBadgeProps) {
  return <span style={variantStyles[variant]}>{children}</span>
}

import type { BadgeProps } from './Badge.types'
import { StyledBadge } from './Badge.styles'

export function Badge({ variant = 'default', children }: BadgeProps) {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>
}

import type { InlineBadgeProps } from './InlineBadge.types'
import { StyledInlineBadge } from './InlineBadge.styles'

export function InlineBadge({ variant = 'success', children }: InlineBadgeProps) {
  return (
    <StyledInlineBadge $variant={variant}>{children}</StyledInlineBadge>
  )
}

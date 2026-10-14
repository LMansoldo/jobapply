import styled from '@emotion/styled'
import type { UITheme } from '../../theme'
import type { InlineBadgeVariant } from './InlineBadge.types'

const variantStyles: Record<InlineBadgeVariant, (theme: UITheme) => string> = {
  success: (t) => `background: ${t.colors.greenBg}; color: ${t.colors.green};`,
  warning: (t) => `background: ${t.colors.warningBg}; color: ${t.colors.warning};`,
}

export const StyledInlineBadge = styled.span<{ $variant: InlineBadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: 1;
  ${({ theme, $variant }) => variantStyles[$variant](theme)}
`

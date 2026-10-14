import styled from '@emotion/styled'
import type { UITheme } from '../../theme'
import type { BadgeVariant } from './Badge.types'

const variantStyles: Record<BadgeVariant, (theme: UITheme) => string> = {
  hot: (t) => `background: ${t.colors.orangeBg}; color: ${t.colors.orange};`,
  new: (t) => `background: ${t.colors.greenBg}; color: ${t.colors.green};`,
  remote: (t) => `background: ${t.colors.blueBg}; color: ${t.colors.blue};`,
  default: (t) => `background: ${t.colors.primaryLight}; color: ${t.colors.primaryDark};`,
}

export const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.badge};
  text-transform: uppercase;
  line-height: 1;
  ${({ theme, $variant }) => variantStyles[$variant](theme)}
`

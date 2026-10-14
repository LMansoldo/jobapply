import styled from '@emotion/styled'
import type { UITheme } from '@jobapply/ui'

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.xxs} 0`};
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Keyword = styled.span`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.textMain};
  flex: 1;
`

export const StatusIcon = styled.span<{ $color: string }>`
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  flex-shrink: 0;
  color: ${({ $color }) => $color};
`

export function getStatusColors(theme: UITheme): Record<string, string> {
  return {
    found: theme.colors.green,
    missing: theme.colors.danger,
    weak: theme.colors.orange,
  }
}

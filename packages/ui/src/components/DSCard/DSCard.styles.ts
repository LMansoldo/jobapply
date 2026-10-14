import styled from '@emotion/styled'

export const StyledCard = styled.div<{ $hoverable?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.base};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: box-shadow 0.2s ease;
  ${({ $hoverable, theme }) =>
    $hoverable
      ? `cursor: pointer;
  &:hover {
    box-shadow: ${theme.shadows.md};
  }`
      : ''}
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const CardTitle = styled.span`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-size: ${({ theme }) => theme.typography.size.xs};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSub};
`

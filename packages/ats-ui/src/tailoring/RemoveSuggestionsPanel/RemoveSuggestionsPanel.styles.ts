import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`

export const SectionLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.danger};
  font-family: ${({ theme }) => theme.typography.family.heading};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 28rem;
  overflow-y: auto;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.dangerBg};
  border: 1px solid ${({ theme }) => theme.colors.danger};
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const SectionBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  font-family: ${({ theme }) => theme.typography.family.body};
  text-transform: uppercase;
`

export const ItemText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
  font-family: ${({ theme }) => theme.typography.family.body};
  margin: 0;
`

export const ReasonText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.typography.family.body};
  margin: 0;
  line-height: 1.5;
`

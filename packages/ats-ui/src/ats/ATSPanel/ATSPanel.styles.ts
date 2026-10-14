import styled from '@emotion/styled'

export const Panel = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const ScoreCenter = styled.div`
  display: flex;
  justify-content: center;
`

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md0};
`

export const SectionTitle = styled.p`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.textSub};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export const KeywordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.surfaceBorder};
`

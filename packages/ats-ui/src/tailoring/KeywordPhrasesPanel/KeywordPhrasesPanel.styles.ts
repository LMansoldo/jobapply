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
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.typography.family.heading};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 32rem;
  overflow-y: auto;
`

export const PhraseRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
`

export const KeywordTag = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.typography.family.body};
  background: ${({ theme }) => theme.colors.primaryMid};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  white-space: nowrap;
`

export const PhraseText = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textMain};
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.5;
  margin: 0;
`

export const CopyBtn = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  border: 1px solid ${({ theme }) => theme.colors.primaryDark};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.white};
  }
`

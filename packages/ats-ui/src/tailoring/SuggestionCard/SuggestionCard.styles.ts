import styled from '@emotion/styled'

export const SuggestionCard = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

export const SuggestionCardIcon = styled.span`
  font-size: 1.4rem;
  line-height: 2rem;
  flex-shrink: 0;
`

export const SuggestionCardText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(124, 58, 237, 0.9);
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.5;
  flex: 1;
`

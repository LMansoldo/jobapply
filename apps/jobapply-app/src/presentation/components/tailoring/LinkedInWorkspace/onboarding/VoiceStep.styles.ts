import styled from '@emotion/styled'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40rem;
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.lg}`};
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 56rem;
  width: 100%;
`

export const Headline = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`

export const Subtext = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 14rem;
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textMain};
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  resize: vertical;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }
`

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const NextBtn = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} 0`};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`

export const SkipRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const SkipBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.xs};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.textMain};
  }
`

export const SkipWarning = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.warning};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

import styled from '@emotion/styled'

export const Root = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.pageBg};
`

export const Icon = styled.span`
  font-size: 4.8rem;
  color: ${({ theme }) => theme.colors.socialLinkedin};
`

export const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.base};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`

export const BackBtn = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;

  &:hover {
    opacity: 0.88;
  }
`

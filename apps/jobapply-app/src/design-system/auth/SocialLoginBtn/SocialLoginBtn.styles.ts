import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'

export const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.white};
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  transition: background 0.15s;
  color: ${({ theme }) => theme.colors.textMain};
`

export const ProviderIcon = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-size: 1.8rem;
`

export const providerColors: Record<string, string> = {
  google: Colors.socialGoogle,
  linkedin: Colors.socialLinkedin,
  github: Colors.socialGithub,
}

export const providerLabels: Record<string, string> = {
  google: 'Entrar com Google',
  linkedin: 'Entrar com LinkedIn',
  github: 'Entrar com GitHub',
}

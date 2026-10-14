import styled from '@emotion/styled'
import { Button } from 'antd'
import type { UITheme } from '../../theme'
import type { DSButtonVariant } from './DSButton.types'

const variantStyles: Record<DSButtonVariant, (theme: UITheme) => string> = {
  primary: (t) => `
    background: ${t.colors.gradientTailorBtn};
    color: ${t.colors.white};
    box-shadow: ${t.shadows.cta};
  `,
  ghost: (t) => `
    background: transparent;
    color: ${t.colors.primaryDark};
    border: 1.5px solid ${t.colors.primaryDark};
  `,
  'ghost-dark': (t) => `
    background: transparent;
    color: ${t.colors.white};
    border: 1.5px solid ${t.colors.white};
  `,
  'solid-white': (t) => `
    background: ${t.colors.white};
    color: ${t.colors.primaryDark};
    box-shadow: ${t.shadows.sm};
  `,
}

export const StyledButton = styled(Button)<{ $variant: DSButtonVariant }>`
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: 4rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: all 0.2s ease;
  border: none;
  font-size: ${({ theme }) => theme.typography.size.md};
  ${({ theme, $variant }) => variantStyles[$variant](theme)}
`

import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: ${({ theme }) => theme.colors.surfaceDarker};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => `${theme.radius.base} ${theme.radius.base} 0 0`};
  flex-wrap: wrap;
`

export const ToolBtn = styled.button<{ $active: boolean; $wide: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme, $wide }) => ($wide ? `${theme.spacing.xxs} ${theme.spacing.md}` : `${theme.spacing.xxs} ${theme.spacing.sm}`)};
  border-radius: ${({ theme }) => theme.radius.xs};
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(124,58,237,0.2)' : 'transparent')};
  color: ${({ theme, $active }) => ($active ? Colors.primary : theme.colors.textSub)};
  font-size: 1.3rem;
  font-weight: ${({ theme, $wide }) => ($wide ? theme.typography.weight.medium : theme.typography.weight.regular)};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  height: 2.8rem;
`

export const Divider = styled.div`
  width: 1px;
  height: 1.8rem;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 ${({ theme }) => theme.spacing.xxs};
  flex-shrink: 0;
`

import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'

export const Bar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: ${({ theme }) => theme.spacing.xxs};
`

export const Chip = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.chip};
  font-size: 1.3rem;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primaryMid : theme.colors.surfaceBorder)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : theme.colors.white)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  flex-shrink: 0;
`

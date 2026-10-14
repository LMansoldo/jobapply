import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'

export const Container = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 2px;
`

export const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 1.3rem;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  border: none;
  background: ${({ theme, $active }) => ($active ? Colors.white : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  transition: background 0.15s, color 0.15s;
`

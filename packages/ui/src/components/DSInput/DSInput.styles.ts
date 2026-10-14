import styled from '@emotion/styled'
import { Input } from 'antd'

export const InputShell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const IconSlot = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  z-index: 1;
  color: ${({ theme }) => theme.colors.textSub};
  pointer-events: none;
  display: flex;
  align-items: center;
`

export const StyledInput = styled(Input)<{ $filled?: boolean; $hasIcon?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $filled }) => ($filled ? theme.colors.white : theme.colors.surfacePage)};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: ${({ theme }) => theme.typography.size.md};
  height: 4.4rem;
  transition: background 0.15s, border-color 0.15s;
  ${({ $hasIcon }) => $hasIcon && 'padding-left: 3.6rem;'}
`

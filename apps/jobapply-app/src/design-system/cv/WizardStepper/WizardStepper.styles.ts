import styled from '@emotion/styled'
import { CheckOutlined } from '@ant-design/icons'
import { Colors } from '../../../styles/theme/colors'

export const Stepper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Step = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: default;
  transition: background 0.15s;
  background: ${({ $active }) => ($active ? Colors.primaryLight : 'transparent')};
`

export const StepCircle = styled.div<{ $done: boolean; $active: boolean }>`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: ${({ theme }) => theme.radius.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-size: 1.3rem;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
  background: ${({ $done, $active }) => ($done ? Colors.success : $active ? Colors.primaryDark : Colors.surfaceBorder)};
  color: ${({ $done, $active }) => ($done || $active ? Colors.white : Colors.textSub)};
`

export const StepCheckIcon = styled(CheckOutlined)`
  font-size: 1.2rem;
`

export const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 1.3rem;
  font-weight: ${({ theme, $active }) => ($active ? theme.typography.weight.semibold : theme.typography.weight.medium)};
  color: ${({ $active }) => ($active ? Colors.primaryDark : Colors.textSub)};
`

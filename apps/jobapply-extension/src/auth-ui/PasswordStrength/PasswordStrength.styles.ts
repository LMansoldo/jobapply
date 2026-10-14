import styled from '@emotion/styled'
import { Colors } from '../../shared/theme/colors'

export const strengthColors = ['transparent', Colors.danger, Colors.orange, Colors.warning, Colors.green]

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`

export const Bars = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Bar = styled.div<{ $color?: string }>`
  flex: 1;
  height: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $color }) => $color ?? theme.colors.surfaceBorder};
  transition: background 0.3s;
`

export const Label = styled.span<{ $color: string }>`
  font-size: 1.2rem;
  transition: color 0.3s;
  color: ${({ $color }) => $color};
`

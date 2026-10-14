import styled from '@emotion/styled'

export const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.8rem;
  background: ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $value: number }>`
  height: 100%;
  width: ${({ $value }) => `${$value}%`};
  background: ${({ theme }) => theme.colors.gradientProgressBar};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: width 0.4s ease;
`

export const ProgressLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textSub};
`

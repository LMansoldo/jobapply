import styled from '@emotion/styled'

export const ScoreRingWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ScoreRingSvgWrapper = styled.div<{ $size: number }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
`

export const ScoreRingTextGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

export const ScoreRingValue = styled.span<{ $size: number }>`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.primaryDark};
  line-height: 1;
  display: block;
  font-size: ${({ $size }) => ($size > 100 ? '2.4rem' : '1.0rem')};
`

export const ScoreRingSublabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSub};
  display: block;
`

export const ScoreRingLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textSub};
`

export const ScoreRingTrack = styled.circle`
  stroke: ${({ theme }) => theme.colors.surfaceBorder};
  fill: none;
`

export const ScoreRingProgress = styled.circle`
  fill: none;
  transition: stroke-dashoffset 0.6s ease;
`

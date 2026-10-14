import type { ProgressBarProps } from './ProgressBar.types'
import { ProgressFill, ProgressLabel, ProgressTrack, ProgressBarWrapper } from './ProgressBar.styles'

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <ProgressBarWrapper>
      {label && <ProgressLabel>{label}</ProgressLabel>}
      <ProgressTrack>
        <ProgressFill $value={clamped} />
      </ProgressTrack>
    </ProgressBarWrapper>
  )
}

import { ScoreRing } from '../../primitives/ScoreRing'
import type { ATSScoreBadgeProps } from './ATSScoreBadge.types'
import * as S from './TailoringContextBar.styles'

export function ATSScoreBadge({ score }: ATSScoreBadgeProps) {
  return (
    <div className={S.scoreBadgeWrapper}>
      <ScoreRing value={score} size={43} />
    </div>
  )
}

import { ScoreRing } from '@jobapply/ui'
import type { ATSScoreBadgeProps } from './ATSScoreBadge.types'
import * as S from './TailoringContextBar.styles'

export function ATSScoreBadge({ score }: ATSScoreBadgeProps) {
  return (
    <S.ScoreBadgeWrapper>
      <ScoreRing value={score} size={43} />
    </S.ScoreBadgeWrapper>
  )
}

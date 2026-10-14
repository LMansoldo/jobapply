import type { SuggestionCardProps } from './SuggestionCard.types'
import * as S from './SuggestionCard.styles'

export function SuggestionCard({ text, icon = '✦' }: SuggestionCardProps) {
  return (
    <S.SuggestionCard>
      <S.SuggestionCardIcon>{icon}</S.SuggestionCardIcon>
      <S.SuggestionCardText>{text}</S.SuggestionCardText>
    </S.SuggestionCard>
  )
}

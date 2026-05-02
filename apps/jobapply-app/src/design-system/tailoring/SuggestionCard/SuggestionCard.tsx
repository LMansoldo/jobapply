import type { SuggestionCardProps } from './SuggestionCard.types'
import * as S from './SuggestionCard.styles'

export function SuggestionCard({ text, icon = '✦' }: SuggestionCardProps) {
  return (
    <div className={S.suggestionCard}>
      <span className={S.suggestionCardIcon}>{icon}</span>
      <span className={S.suggestionCardText}>{text}</span>
    </div>
  )
}
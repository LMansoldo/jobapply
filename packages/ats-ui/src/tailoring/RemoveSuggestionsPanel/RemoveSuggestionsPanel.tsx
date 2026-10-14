import { useTranslation } from 'react-i18next'
import type { RemoveSuggestionsPanelProps } from './RemoveSuggestionsPanel.types'
import * as S from './RemoveSuggestionsPanel.styles'

export function RemoveSuggestionsPanel({ suggestions }: RemoveSuggestionsPanelProps) {
  const { t } = useTranslation()

  if (suggestions.length === 0) return null

  return (
    <S.Container>
      <S.SectionLabel>✕ {t('tailoring.removeSuggestions')}</S.SectionLabel>
      <S.List>
        {suggestions.map((s) => (
          <S.Card key={s.section + s.item}>
            <S.CardHeader>
              <S.SectionBadge>{s.section}</S.SectionBadge>
              <S.ItemText>{s.item}</S.ItemText>
            </S.CardHeader>
            <S.ReasonText>{s.reason}</S.ReasonText>
          </S.Card>
        ))}
      </S.List>
    </S.Container>
  )
}

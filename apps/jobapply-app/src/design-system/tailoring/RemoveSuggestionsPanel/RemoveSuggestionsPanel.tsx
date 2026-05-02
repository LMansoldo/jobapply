import { useTranslation } from 'react-i18next'
import type { RemoveSuggestionsPanelProps } from './RemoveSuggestionsPanel.types'
import * as S from './RemoveSuggestionsPanel.styles'

export function RemoveSuggestionsPanel({ suggestions }: RemoveSuggestionsPanelProps) {
  const { t } = useTranslation()

  if (suggestions.length === 0) return null

  return (
    <div className={S.container}>
      <p className={S.sectionLabel}>✕ {t('tailoring.removeSuggestions')}</p>
      <div className={S.list}>
        {suggestions.map((s) => (
          <div key={s.section + s.item} className={S.card}>
            <div className={S.cardHeader}>
              <span className={S.sectionBadge}>{s.section}</span>
              <p className={S.itemText}>{s.item}</p>
            </div>
            <p className={S.reasonText}>{s.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

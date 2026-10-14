import { useTranslation } from 'react-i18next'
import {
  Rail,
  RailCount,
  RailEyebrow,
  RailHeader,
  RailHint,
  RailTitle,
} from '../../RichMarkdownEditor.styles'
import type { Suggestion } from '../types'
import { SuggestionList } from './SuggestionList'

export interface SuggestionRailProps {
  suggestions: Suggestion[]
  onSuggestionClick: (s: Suggestion) => void
  onApplyInsert: (s: Suggestion) => void
  onInsertPhrase: (text: string) => void
  onDismiss: (s: Suggestion) => void
}

export function SuggestionRail({
  suggestions,
  onSuggestionClick,
  onApplyInsert,
  onInsertPhrase,
  onDismiss,
}: SuggestionRailProps) {
  const { t } = useTranslation()

  if (suggestions.length === 0) return null

  return (
    <Rail aria-label={t('tailoring.richEditor.suggestionsTitle')}>
      <RailHeader>
        <div>
          <RailEyebrow>{t('tailoring.richEditor.atsEyebrow')}</RailEyebrow>
          <RailTitle>{t('tailoring.richEditor.suggestionsTitle')}</RailTitle>
        </div>
        <RailCount>{suggestions.length}</RailCount>
      </RailHeader>
      <RailHint>{t('tailoring.richEditor.suggestionsHint')}</RailHint>
      <SuggestionList
        suggestions={suggestions}
        onSuggestionClick={onSuggestionClick}
        onApplyInsert={onApplyInsert}
        onInsertPhrase={onInsertPhrase}
        onDismiss={onDismiss}
      />
    </Rail>
  )
}

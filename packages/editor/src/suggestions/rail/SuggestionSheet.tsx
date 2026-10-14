import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import {
  RailTitle,
  SheetBody,
  SheetCloseButton,
  SheetDragHandle,
  SheetHeader,
  SuggestionSheetPanel,
} from '../../RichMarkdownEditor.styles'
import type { Suggestion } from '../types'
import { SuggestionList } from './SuggestionList'

export interface SuggestionSheetProps {
  suggestions: Suggestion[]
  onClose: () => void
  onSuggestionClick: (s: Suggestion) => void
  onApplyInsert: (s: Suggestion) => void
  onInsertPhrase: (text: string) => void
  onDismiss: (s: Suggestion) => void
}

export function SuggestionSheet({
  suggestions,
  onClose,
  onSuggestionClick,
  onApplyInsert,
  onInsertPhrase,
  onDismiss,
}: SuggestionSheetProps) {
  const { t } = useTranslation()

  return (
    <SuggestionSheetPanel
      role="dialog"
      aria-label={t('tailoring.richEditor.suggestionsTitle')}
    >
      <SheetDragHandle />
      <SheetHeader>
        <RailTitle>
          {t('tailoring.richEditor.suggestionsTitle')} ({suggestions.length})
        </RailTitle>
        <SheetCloseButton
          type="button"
          onClick={onClose}
          aria-label={t('tailoring.richEditor.sheetClose')}
        >
          <CloseOutlined />
        </SheetCloseButton>
      </SheetHeader>
      <SheetBody>
        <SuggestionList
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
          onApplyInsert={onApplyInsert}
          onInsertPhrase={onInsertPhrase}
          onDismiss={onDismiss}
        />
      </SheetBody>
    </SuggestionSheetPanel>
  )
}

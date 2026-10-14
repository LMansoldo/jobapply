import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Suggestion } from '../types'
import {
  PhraseChip,
  RailButton,
  RailCard,
  RailCardActions,
  RailCardReason,
  RailCardText,
  RailDismissButton,
  RailGroupTitle,
  RailPriorityBadge,
} from '../../RichMarkdownEditor.styles'

export interface SuggestionListProps {
  suggestions: Suggestion[]
  onSuggestionClick: (s: Suggestion) => void
  onApplyInsert: (s: Suggestion) => void
  onInsertPhrase: (text: string) => void
  onDismiss: (s: Suggestion) => void
}

export function SuggestionList({
  suggestions,
  onSuggestionClick,
  onApplyInsert,
  onInsertPhrase,
  onDismiss,
}: SuggestionListProps) {
  const { t } = useTranslation()
  const generalLabel = t('tailoring.richEditor.general')

  const groups = useMemo(() => {
    const map = new Map<string, Suggestion[]>()
    for (const sug of suggestions) {
      const key = sug.section ?? generalLabel
      const list = map.get(key) ?? []
      list.push(sug)
      map.set(key, list)
    }
    return [...map.entries()]
  }, [suggestions, generalLabel])

  return (
    <>
      {groups.map(([section, items]) => (
        <section key={section}>
          <RailGroupTitle>
            {section} ({items.length})
          </RailGroupTitle>
          {items.map((sug) => (
            <RailCard key={sug.id} data-kind={sug.kind}>
              {sug.kind === 'replace' && (
                <>
                  <RailCardText>
                    {sug.from} → {sug.to}
                  </RailCardText>
                  <RailCardActions>
                    <RailButton
                      onClick={() => onSuggestionClick(sug)}
                      aria-label={t('tailoring.richEditor.apply')}
                    >
                      {t('tailoring.richEditor.apply')}
                    </RailButton>
                    <RailDismissButton
                      onClick={() => onDismiss(sug)}
                      aria-label={t('tailoring.richEditor.dismiss')}
                    >
                      {t('tailoring.richEditor.dismiss')}
                    </RailDismissButton>
                  </RailCardActions>
                </>
              )}
              {sug.kind === 'remove' && (
                <>
                  <RailCardText>{sug.item}</RailCardText>
                  <RailCardReason>{sug.reason}</RailCardReason>
                  <RailCardActions>
                    <RailButton
                      onClick={() => onSuggestionClick(sug)}
                      aria-label={t('tailoring.richEditor.apply')}
                    >
                      {t('tailoring.richEditor.apply')}
                    </RailButton>
                    <RailDismissButton
                      onClick={() => onDismiss(sug)}
                      aria-label={t('tailoring.richEditor.dismiss')}
                    >
                      {t('tailoring.richEditor.dismiss')}
                    </RailDismissButton>
                  </RailCardActions>
                </>
              )}
              {sug.kind === 'insert' && (
                <>
                  <RailCardText>{sug.keyword}</RailCardText>
                  <RailCardActions>
                    <RailButton onClick={() => onApplyInsert(sug)}>
                      {t('tailoring.richEditor.insertSection')}
                    </RailButton>
                    {(sug.phrases ?? []).map((phrase) => (
                      <PhraseChip
                        key={phrase}
                        onClick={() => onInsertPhrase(phrase)}
                      >
                        {phrase}
                      </PhraseChip>
                    ))}
                    <RailDismissButton
                      onClick={() => onDismiss(sug)}
                      aria-label={t('tailoring.richEditor.dismiss')}
                    >
                      {t('tailoring.richEditor.dismiss')}
                    </RailDismissButton>
                  </RailCardActions>
                </>
              )}
              {sug.kind === 'comment' && (
                <>
                  <RailPriorityBadge $priority={sug.priority}>
                    {sug.priority}
                  </RailPriorityBadge>
                  <RailCardText>{sug.text}</RailCardText>
                  <RailCardActions>
                    <RailDismissButton
                      onClick={() => onDismiss(sug)}
                      aria-label={t('tailoring.richEditor.dismiss')}
                    >
                      {t('tailoring.richEditor.dismiss')}
                    </RailDismissButton>
                  </RailCardActions>
                </>
              )}
            </RailCard>
          ))}
        </section>
      ))}
    </>
  )
}

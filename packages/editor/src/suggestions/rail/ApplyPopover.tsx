import { useTranslation } from 'react-i18next'
import type { Suggestion } from '../types'
import {
  ApplyButton,
  ApplyPopoverActions,
  ApplyPopoverCard,
  ApplyPopoverText,
  DismissButton,
} from '../../RichMarkdownEditor.styles'

export interface ApplyPopoverProps {
  suggestion: Suggestion
  coords: { top: number; left: number }
  canApply: boolean
  $mobile?: boolean
  onApply: () => void
  onDismiss: () => void
  onClose: () => void
}

export function ApplyPopover({
  suggestion,
  coords,
  canApply,
  $mobile = false,
  onApply,
  onDismiss,
  onClose,
}: ApplyPopoverProps) {
  const { t } = useTranslation()

  return (
    <ApplyPopoverCard
      role="dialog"
      $top={coords.top}
      $left={coords.left}
      $mobile={$mobile}
      onClick={(e) => e.stopPropagation()}
    >
      {suggestion.kind === 'replace' && (
        <ApplyPopoverText>
          {suggestion.from} → <strong>{suggestion.to}</strong>
        </ApplyPopoverText>
      )}
      {suggestion.kind === 'remove' && (
        <>
          <ApplyPopoverText>{suggestion.item}</ApplyPopoverText>
          <ApplyPopoverText>
            {t('tailoring.richEditor.removeConfirm')}
          </ApplyPopoverText>
        </>
      )}
      {suggestion.kind === 'insert' && (
        <ApplyPopoverText>
          {suggestion.keyword}
          {suggestion.phrases?.length
            ? ` — ${suggestion.phrases.join(' · ')}`
            : ''}
        </ApplyPopoverText>
      )}
      {suggestion.kind === 'comment' && (
        <ApplyPopoverText>{suggestion.text}</ApplyPopoverText>
      )}
      <ApplyPopoverActions>
        {canApply && (
          <ApplyButton onClick={onApply}>
            {t('tailoring.richEditor.apply')}
          </ApplyButton>
        )}
        {(suggestion.kind === 'replace' || suggestion.kind === 'remove') &&
          canApply && (
            <DismissButton onClick={onDismiss}>
              {t('tailoring.richEditor.dismiss')}
            </DismissButton>
          )}
        {suggestion.kind === 'comment' && (
          <DismissButton onClick={onClose}>
            {t('tailoring.richEditor.dismiss')}
          </DismissButton>
        )}
        {suggestion.kind !== 'comment' && !canApply && (
          <DismissButton onClick={onClose}>
            {t('tailoring.richEditor.resolved')}
          </DismissButton>
        )}
      </ApplyPopoverActions>
    </ApplyPopoverCard>
  )
}

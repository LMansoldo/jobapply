import { useTranslation } from 'react-i18next'
import { Modal } from '../../../components/Modal'
import type { RemoveSuggestion } from './TailoringEditorPanel.types'
import * as S from './TailoringEditorPanel.styles'

interface RemoveSuggestionsModalProps {
  open: boolean
  onClose: () => void
  suggestions?: RemoveSuggestion[]
}

export function RemoveSuggestionsModal({ open, onClose, suggestions = [] }: RemoveSuggestionsModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width={680}
      styles={{
        body: { background: 'transparent', padding: 0, margin: 0 },
        content: {
          background: S.Colors.surfaceEditor,
          border: `1px solid ${S.Colors.surfaceEditorBorder}`,
          borderRadius: S.BorderRadius.none,
        },
      }}
    >
      <S.PhrasesModalBody>
        <S.PhrasesModalHeader>
          <S.PulseDot />
          <S.PhrasesModalTitle>{t('tailoring.removeFromCV')}</S.PhrasesModalTitle>
        </S.PhrasesModalHeader>

        <S.PhraseList>
          {suggestions.length > 0 ? (
            suggestions.map((s, index) => (
              <S.RemoveItem key={index}>
                <S.RemoveItemHeader>
                  <S.SectionBadge>{s.section}</S.SectionBadge>
                  <S.RemoveItemText>{s.item}</S.RemoveItemText>
                </S.RemoveItemHeader>
                <S.RemoveReasonText>{s.reason}</S.RemoveReasonText>
              </S.RemoveItem>
            ))
          ) : (
            <S.EmptyStateDiv>{t('tailoring.noRemoveSuggestions')}</S.EmptyStateDiv>
          )}
        </S.PhraseList>

        <S.PhrasesModalFooter>
          <S.ModalCloseBtn onClick={onClose}>{t('common.cancel')}</S.ModalCloseBtn>
        </S.PhrasesModalFooter>
      </S.PhrasesModalBody>
    </Modal>
  )
}

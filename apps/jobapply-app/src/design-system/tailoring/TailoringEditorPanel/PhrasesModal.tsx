import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Modal } from '../../../components/Modal'
import type { EditorKeywords } from './TailoringEditorPanel.types'
import * as S from './TailoringEditorPanel.styles'

interface PhrasesModalProps {
  open: boolean
  onClose: () => void
  editorKeywords?: EditorKeywords
  onReplaceKeyword?: (from: string, to: string) => void
}

export function PhrasesModal({
  open,
  onClose,
  editorKeywords,
  onReplaceKeyword,
}: PhrasesModalProps) {
  const { t } = useTranslation()
  const phrases = editorKeywords?.toRephrase ?? []
  const hasPhrases = phrases.length > 0

  const [checked, setChecked] = useState<Set<number>>(() => new Set(phrases.map((_, i) => i)))

  useEffect(() => {
    if (open) {
      setChecked(new Set((editorKeywords?.toRephrase ?? []).map((_, i) => i)))
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCheck = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleConfirm = () => {
    phrases.forEach((phrase, i) => {
      if (checked.has(i)) onReplaceKeyword?.(phrase.from, phrase.to)
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width={640}
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
          <S.PhrasesModalTitle>{t('tailoring.phrasesToChange')}</S.PhrasesModalTitle>
        </S.PhrasesModalHeader>

        <S.PhraseList>
          {hasPhrases ? (
            phrases.map((phrase, index) => (
              <S.PhraseItem key={index}>
                <S.PhraseCheckbox
                  type="checkbox"
                  checked={checked.has(index)}
                  onChange={() => toggleCheck(index)}
                />
                <S.PhraseComparison>
                  <S.PhraseFrom>{phrase.from}</S.PhraseFrom>
                  <S.PhraseArrow><ArrowRightOutlined /></S.PhraseArrow>
                  <S.PhraseTo>{phrase.to}</S.PhraseTo>
                </S.PhraseComparison>
              </S.PhraseItem>
            ))
          ) : (
            <S.EmptyStateDiv>{t('tailoring.noPhrasesToChange')}</S.EmptyStateDiv>
          )}
        </S.PhraseList>

        <S.PhrasesModalFooter>
          <S.ModalCloseBtn onClick={onClose}>{t('common.cancel')}</S.ModalCloseBtn>
          {hasPhrases && (
            <S.ModalConfirmBtn onClick={handleConfirm} disabled={checked.size === 0}>
              {t('common.confirm')}
            </S.ModalConfirmBtn>
          )}
        </S.PhrasesModalFooter>
      </S.PhrasesModalBody>
    </Modal>
  )
}

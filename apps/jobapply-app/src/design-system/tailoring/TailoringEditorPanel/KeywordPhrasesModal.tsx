import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { Modal } from '../../../components/Modal'
import type { KeywordPhrase } from './TailoringEditorPanel.types'
import * as S from './TailoringEditorPanel.styles'

interface KeywordPhrasesModalProps {
  open: boolean
  onClose: () => void
  phrases?: KeywordPhrase[]
}

export function KeywordPhrasesModal({ open, onClose, phrases = [] }: KeywordPhrasesModalProps) {
  const { t } = useTranslation()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

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
          <S.PhrasesModalTitle>{t('tailoring.keywordPhrases')}</S.PhrasesModalTitle>
        </S.PhrasesModalHeader>

        <S.PhraseList>
          {phrases.length > 0 ? (
            phrases.map((entry, index) => (
              <S.KPhraseItem key={index}>
                <S.KPhraseKeyword>{entry.keyword}</S.KPhraseKeyword>
                <S.KPhraseRow>
                  <S.KPhraseContent>
                    <S.KPhraseText>{entry.phrase}</S.KPhraseText>
                  </S.KPhraseContent>
                  <S.CopyBtn
                    type="button"
                    onClick={() => handleCopy(entry.phrase, index)}
                  >
                    {copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />}
                    {copiedIndex === index ? t('tailoring.phraseCopied') : t('tailoring.copyPhrase')}
                  </S.CopyBtn>
                </S.KPhraseRow>
              </S.KPhraseItem>
            ))
          ) : (
            <S.EmptyStateDiv>{t('tailoring.noPhrasesToChange')}</S.EmptyStateDiv>
          )}
        </S.PhraseList>

        <S.PhrasesModalFooter>
          <S.ModalCloseBtn onClick={onClose}>{t('common.cancel')}</S.ModalCloseBtn>
        </S.PhrasesModalFooter>
      </S.PhrasesModalBody>
    </Modal>
  )
}

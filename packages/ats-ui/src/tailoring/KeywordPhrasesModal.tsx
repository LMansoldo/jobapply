import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@emotion/react'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import type { KeywordPhrase } from '@jobapply/contracts'
import * as S from './modals.styles'

interface KeywordPhrasesModalProps {
  open: boolean
  onClose: () => void
  phrases?: KeywordPhrase[]
}

export function KeywordPhrasesModal({ open, onClose, phrases = [] }: KeywordPhrasesModalProps) {
  const { t } = useTranslation()
  const theme = useTheme()
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
          background: theme.colors.surfaceEditor,
          border: `1px solid ${theme.colors.surfaceEditorBorder}`,
          borderRadius: theme.radius.none,
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
            phrases.map((entry) =>
              entry.phrases.map((phrase, i) => {
                const flatIndex = phrases.indexOf(entry) * 100 + i
                return (
                  <S.KPhraseItem key={`${entry.keyword}-${i}`}>
                    <S.KPhraseKeyword>{entry.keyword}</S.KPhraseKeyword>
                    <S.KPhraseRow>
                      <S.KPhraseContent>
                        <S.KPhraseText>{phrase}</S.KPhraseText>
                      </S.KPhraseContent>
                      <S.CopyBtn
                        type="button"
                        onClick={() => handleCopy(phrase, flatIndex)}
                      >
                        {copiedIndex === flatIndex ? <CheckOutlined /> : <CopyOutlined />}
                        {copiedIndex === flatIndex ? t('tailoring.phraseCopied') : t('tailoring.copyPhrase')}
                      </S.CopyBtn>
                    </S.KPhraseRow>
                  </S.KPhraseItem>
                )
              })
            )
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

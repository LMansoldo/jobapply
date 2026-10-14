import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import type { KeywordPhrasesPanelProps } from './KeywordPhrasesPanel.types'
import * as S from './KeywordPhrasesPanel.styles'

export function KeywordPhrasesPanel({ phrases, onCopyPhrase }: KeywordPhrasesPanelProps) {
  const { t } = useTranslation()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (phrases.length === 0) return null

  const handleCopy = (phrase: string, key: string) => {
    onCopyPhrase(phrase)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <S.Container>
      <S.SectionLabel>✦ {t('tailoring.keywordPhrases')}</S.SectionLabel>
      <S.List>
        {phrases.map((item) =>
          item.phrases.map((phrase, i) => {
            const itemKey = `${item.keyword}-${i}`
            const copied = copiedKey === itemKey
            return (
              <S.PhraseRow key={itemKey}>
                <S.KeywordTag>{item.keyword}</S.KeywordTag>
                <S.PhraseText>{phrase}</S.PhraseText>
                <S.CopyBtn
                  type="button"
                  onClick={() => handleCopy(phrase, itemKey)}
                >
                  {copied ? <CheckOutlined /> : <CopyOutlined />}
                  {copied ? t('tailoring.phraseCopied') : t('tailoring.copyPhrase')}
                </S.CopyBtn>
              </S.PhraseRow>
            )
          })
        )}
      </S.List>
    </S.Container>
  )
}

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
    <div className={S.container}>
      <p className={S.sectionLabel}>✦ {t('tailoring.keywordPhrases')}</p>
      <div className={S.list}>
        {phrases.map((item) => {
          const itemKey = item.keyword + item.phrase
          const copied = copiedKey === itemKey
          return (
            <div key={itemKey} className={S.phraseRow}>
              <span className={S.keywordTag}>{item.keyword}</span>
              <p className={S.phraseText}>{item.phrase}</p>
              <button
                type="button"
                className={S.copyBtn}
                onClick={() => handleCopy(item.phrase, itemKey)}
              >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
                {copied ? t('tailoring.phraseCopied') : t('tailoring.copyPhrase')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

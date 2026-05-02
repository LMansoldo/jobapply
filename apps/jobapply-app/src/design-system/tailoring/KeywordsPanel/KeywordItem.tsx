import type { KeywordItemProps } from './KeywordsPanel.types'
import * as S from './KeywordsPanel.styles'

export function KeywordItem({ keyword, type, onClick, title }: KeywordItemProps) {
  const className = type === 'add' ? S.keywordChipAdd : S.keywordChipRephrase

  return (
    <div className={S.keywordChipWrapper}>
      <button
        type="button"
        className={className}
        onClick={onClick}
        title={title}
      >
        {keyword.length > 40 ? `${keyword.slice(0, 40)}…` : keyword}
      </button>
    </div>
  )
}
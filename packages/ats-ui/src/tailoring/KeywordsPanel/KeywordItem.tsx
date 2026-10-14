import type { KeywordItemProps } from './KeywordsPanel.types'
import * as S from './KeywordsPanel.styles'

export function KeywordItem({ keyword, type, onClick, title }: KeywordItemProps) {
  const Chip = type === 'add' ? S.KeywordChipAdd : S.KeywordChipRephrase

  return (
    <S.KeywordChipWrapper>
      <Chip
        type="button"
        onClick={onClick}
        title={title}
      >
        {keyword.length > 40 ? `${keyword.slice(0, 40)}…` : keyword}
      </Chip>
    </S.KeywordChipWrapper>
  )
}

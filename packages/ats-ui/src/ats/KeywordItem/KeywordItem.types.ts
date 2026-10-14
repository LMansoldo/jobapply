export type KeywordStatus = 'found' | 'missing' | 'weak'

export interface KeywordItemProps {
  keyword: string
  status: KeywordStatus
}

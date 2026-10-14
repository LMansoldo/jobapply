import type { KeywordStatus } from '../KeywordItem/KeywordItem.types'

export interface ATSCategory {
  name: string
  value: number
}

export interface ATSKeyword {
  keyword: string
  status: KeywordStatus
}

export interface ATSPanelProps {
  score: number
  categories?: ATSCategory[]
  keywords?: ATSKeyword[]
}

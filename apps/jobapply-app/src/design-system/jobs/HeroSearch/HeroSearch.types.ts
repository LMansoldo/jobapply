export interface HeroSearchProps {
  keywordValue: string
  locationValue: string
  onKeywordChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
}

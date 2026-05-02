export interface HeroSectionProps {
  keywordValue: string
  locationValue: string
  onKeywordChange: (v: string) => void
  onLocationChange: (v: string) => void
  onSearch: () => void
  quickChips?: string[]
  onChipClick?: (chip: string) => void
}

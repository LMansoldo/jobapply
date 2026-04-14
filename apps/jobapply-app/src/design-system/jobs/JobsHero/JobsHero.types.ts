import type { QuickChip } from './helpers'

export interface HeroHeadlineProps {
  title: string
  subtitle: string
}

export interface HeroSearchFormProps {
  search: string
  location: string
  searchPlaceholder: string
  locationPlaceholder: string
  searchLabel: string
  onSearchChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSubmit: () => void
}

export interface HeroQuickChipsProps {
  chips: QuickChip[]
  onChipClick: (label: string) => void
}

export interface JobsHeroProps {
  search: string
  location: string
  onSearchChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSubmit?: () => void
}

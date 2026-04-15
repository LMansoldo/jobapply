import type { QuickChip } from './helpers'

export interface HeroHeadlineProps {
  title: string
  subtitle: string
}

export interface HeroSearchFormProps {
  search: string
  searchPlaceholder: string
  searchLabel: string
  onSearchChange: (value: string) => void
  onSubmit: () => void
}

export interface HeroQuickChipsProps {
  chips: QuickChip[]
  onChipClick: (label: string) => void
}

export interface JobsHeroProps {
  search: string
  onSearchChange: (value: string) => void
  onSubmit?: () => void
}

import type { User } from '../../../domain/auth/types'
import type { JobFilters } from '../../../domain/jobs/types'
import type { JobAlert } from '../JobAlertsCard/JobAlertsCard.types'
import type { NewsItem } from '../IndustryNewsCard/IndustryNewsCard.types'
import type { SortOption } from '../SortDropdown'

export interface JobsTopBarProps {
  user: User
  completionPercent: number
  applications?: number
  interviews?: number
  offers?: number
  alerts: JobAlert[]
  news: NewsItem[]
  filters: JobFilters
  sort: SortOption
  onViewProfile?: () => void
  onFilterChange: (key: keyof JobFilters, value: string | string[] | number | undefined) => void
  onSortChange: (sort: SortOption) => void
  onNewAlert?: () => void
}

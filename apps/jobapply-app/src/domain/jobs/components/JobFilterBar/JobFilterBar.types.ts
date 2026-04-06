/**
 * @file JobFilterBar.types.ts
 * @description Type definitions for the JobFilterBar component.
 */
import type { JobFilters } from '../../types'

/** Props for the JobFilterBar component */
export interface JobFilterBarProps {
  /** The current filter state */
  filters: JobFilters
  /** Callback to update a single filter key */
  onFilterChange: (key: keyof JobFilters, value: string | string[] | number | undefined) => void
  /** Callback to manually reload jobs */
  onReload: () => void
}

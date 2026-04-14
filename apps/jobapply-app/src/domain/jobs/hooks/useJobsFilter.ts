import { useState, useRef, useCallback } from 'react'
import type { JobFilters } from '../types'
import type { SortOption } from '../../../design-system/jobs/SortDropdown'

export interface UseJobsFilterReturn {
  filters: JobFilters
  sort: SortOption
  search: string
  location: string
  dismissed: Set<string>
  handleFilterChange: (key: keyof JobFilters, value: string | string[] | number | undefined) => void
  handleSortChange: (sort: SortOption) => void
  handleSearchChange: (value: string) => void
  handleLocationChange: (value: string) => void
  handleDismiss: (id: string) => void
  /** Clears all active filters and resets sort */
  handleClearAll: () => void
}

export function useJobsFilter(
  onFiltersReady?: (filters: JobFilters) => void,
): UseJobsFilterReturn {
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20, sort: 'newest' })
  const [sort, setSort] = useState<SortOption>('newest')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const applyFilters = useCallback(
    (next: JobFilters) => {
      setFilters(next)
      onFiltersReady?.(next)
    },
    [onFiltersReady],
  )

  function handleFilterChange(key: keyof JobFilters, value: string | string[] | number | undefined) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const next = { ...filters, [key]: value, page: 1 }
    if (typeof value === 'string') {
      debounceRef.current = setTimeout(() => applyFilters(next), 400)
      setFilters(next)
    } else {
      applyFilters(next)
    }
  }

  function handleSortChange(newSort: SortOption) {
    setSort(newSort)
    handleFilterChange('sort', newSort)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    handleFilterChange('title', value)
  }

  function handleLocationChange(value: string) {
    setLocation(value)
    handleFilterChange('location', value)
  }

  function handleDismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]))
  }

  function handleClearAll() {
    setSort('newest')
    setSearch('')
    setLocation('')
    applyFilters({ page: 1, limit: 20, sort: 'newest' })
  }

  return {
    filters,
    sort,
    search,
    location,
    dismissed,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
    handleLocationChange,
    handleDismiss,
    handleClearAll,
  }
}

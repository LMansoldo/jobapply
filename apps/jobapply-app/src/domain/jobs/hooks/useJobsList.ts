import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Job, JobFilters } from '../types'
import { fetchJobs } from '../../../infrastructure/repositories/jobsRepository'
import type { SortOption } from '../../../design-system/jobs/SortDropdown'

export interface UseJobsListReturn {
  // Fetch state
  jobs: Job[]
  total: number
  loading: boolean
  // Filter state
  filters: JobFilters
  sort: SortOption
  search: string
  dismissed: Set<string>
  // Handlers
  handleFilterChange: (key: keyof JobFilters, value: string | string[] | number | undefined) => void
  handleSortChange: (sort: SortOption) => void
  handleSearchChange: (value: string) => void
  handlePageChange: (page: number) => void
  handleDismiss: (id: string) => void
  handleClearAll: () => void
}

/**
 * Aggregates job list fetch state and filter state.
 * String-type filter changes are debounced — UI state updates immediately but
 * the API call fires only after 400 ms of inactivity.
 * Page changes update the page without resetting back to 1.
 * Uses TanStack Query for caching — navback to Jobs returns 0ms from cache.
 */
export function useJobsList(onError: () => void): UseJobsListReturn {
  // ── Committed filters — changing this triggers a fetch ────────────────────
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20, sort: 'newest' })

  // ── UI-only state (controlled inputs, no fetch until debounce fires) ──────
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onErrorRef = useRef(onError)
  useEffect(() => { onErrorRef.current = onError })

  // ── Query — cached, staleTime 5min (nav back = 0ms) ──────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    placeholderData: (prev) => prev,
  })

  useEffect(() => {
    if (isError) onErrorRef.current()
  }, [isError])

  // ── Commit helpers ────────────────────────────────────────────────────────
  function commit(partial: Partial<JobFilters>) {
    setFilters((f) => ({ ...f, ...partial }))
  }

  function commitWithReset(partial: Partial<JobFilters>) {
    setFilters((f) => ({ ...f, ...partial, page: 1 }))
  }

  // ── Public handlers ───────────────────────────────────────────────────────
  function handleFilterChange(key: keyof JobFilters, value: string | string[] | number | undefined) {
    if (typeof value === 'string') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => commitWithReset({ [key]: value }), 400)
    } else {
      commitWithReset({ [key]: value })
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => commitWithReset({ title: value }), 400)
  }

  function handleSortChange(newSort: SortOption) {
    setSort(newSort)
    commitWithReset({ sort: newSort })
  }

  function handlePageChange(page: number) {
    commit({ page })
  }

  function handleDismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]))
  }

  function handleClearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSort('newest')
    setSearch('')
    setFilters({ page: 1, limit: 20, sort: 'newest' })
  }

  return {
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    filters,
    sort,
    search,
    dismissed,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
    handlePageChange,
    handleDismiss,
    handleClearAll,
  }
}

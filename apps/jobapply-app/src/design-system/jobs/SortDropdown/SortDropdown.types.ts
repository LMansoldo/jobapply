export type SortOption = 'newest' | 'oldest'

export interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

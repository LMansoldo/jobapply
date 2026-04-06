export type SortOption = 'relevant' | 'recent' | 'salary' | 'applications'

export interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

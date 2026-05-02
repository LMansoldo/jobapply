export interface FilterTag {
  label: string
  active: boolean
}

export interface FilterTagCloudProps {
  tags: FilterTag[]
  onChange: (label: string, active: boolean) => void
}

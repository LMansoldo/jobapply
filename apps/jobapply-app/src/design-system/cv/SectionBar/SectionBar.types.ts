export interface SectionItem {
  key: string
  label: string
}

export interface SectionBarProps {
  sections: SectionItem[]
  activeKey: string
  onChange: (key: string) => void
}

export interface LangTab {
  key: string
  label: string
}

export interface LangTabsProps {
  tabs: LangTab[]
  activeKey: string
  onChange: (key: string) => void
}

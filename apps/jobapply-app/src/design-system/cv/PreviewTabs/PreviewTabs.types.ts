export type PreviewTabKey = 'editor' | 'preview'

export interface PreviewTabsProps {
  activeTab: PreviewTabKey
  onChange: (tab: PreviewTabKey) => void
}

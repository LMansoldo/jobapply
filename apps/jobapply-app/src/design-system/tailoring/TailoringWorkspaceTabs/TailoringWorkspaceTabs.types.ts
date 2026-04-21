export type WorkspaceTab = 'ats' | 'cover' | 'video' | 'interview' | 'linkedin'

export interface TailoringWorkspaceTabsProps {
  /** Currently active tab */
  activeTab: WorkspaceTab
  /** Callback when tab changes */
  onTabChange: (tab: WorkspaceTab) => void
  /** Number of suggestions for ATS tab badge */
  suggestionsCount: number
}
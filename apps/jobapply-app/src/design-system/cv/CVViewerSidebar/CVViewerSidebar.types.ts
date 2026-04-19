export interface CompletionItem {
  label: string
  done: boolean
  color?: string
}

export interface CVViewerSidebarProps {
  activeLocale: 'pt-BR' | 'en'
  hasEn: boolean
  hasPtBr: boolean
  onLocaleChange: (locale: 'pt-BR' | 'en') => void
  onEdit: () => void
  onExportPDF: () => void
  onExportMarkdown: () => void
  onDelete: () => void
  onShare?: () => void
  onDeleteVersion?: () => void
  score: number
  completionItems: CompletionItem[]
  visibility: { views: number; searches: number; saved: number }
}

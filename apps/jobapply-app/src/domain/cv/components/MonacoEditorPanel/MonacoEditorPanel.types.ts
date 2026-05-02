/**
 * @file MonacoEditorPanel.types.ts
 * @description Type definitions for the MonacoEditorPanel component.
 */

/** Props for the MonacoEditorPanel component */
export interface MonacoEditorPanelProps {
  /** Current markdown value */
  value: string
  /** Callback when the value changes */
  onChange: (v: string) => void
  /** List of validation error messages to display */
  errors: string[]
  /** Editor height in pixels (desktop split view) */
  height?: number
  /** Locale for this editor instance */
  locale?: 'pt-BR' | 'en'
  /** Whether this step is optional (shows badge) */
  isOptional?: boolean
  /** Whether to show the empty-state overlay (EN step with no content) */
  isEmpty?: boolean
  /** Callback for "Começar do zero" */
  onStartFromScratch?: () => void
  /** Callback for "Traduzir PT-BR" */
  onTranslateFromPtBr?: () => void
  /** Callback for "Salvar rascunho" */
  onSaveDraft?: () => void
}

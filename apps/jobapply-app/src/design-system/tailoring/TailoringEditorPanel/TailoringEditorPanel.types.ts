export interface TailoringEditorPanelProps {
  value: string
  onChange: (v: string) => void
  locale?: 'pt-BR' | 'en'
}

export interface TailoringEditorHandle {
  /** Insert text at the current cursor position and flash green */
  insertAtCursor: (text: string) => void
  /** Find `from` in the document, replace with `to`, scroll to it and flash amber */
  findAndReplace: (from: string, to: string) => void
  /** Clear all diff decorations */
  clearDiff: () => void
  /** Toggle diff visibility */
  toggleDiff: () => void
  /** Reset diff base to current text */
  resetDiffBase: () => void
}

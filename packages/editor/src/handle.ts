export interface EditorHandle {
  insertAtCursor: (text: string) => void
  findAndReplace: (from: string, to: string) => void
  clearDiff: () => void
  toggleDiff: () => void
  resetDiffBase: () => void
}

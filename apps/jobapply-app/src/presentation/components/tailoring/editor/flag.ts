export const RICH_EDITOR_ENABLED = true

const STORAGE_KEY = 'dojob:richEditor'

export function isRichEditorEnabled(): boolean {
  if (typeof window === 'undefined') return RICH_EDITOR_ENABLED
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === 'true') return true
  if (raw === 'false') return false
  return RICH_EDITOR_ENABLED
}

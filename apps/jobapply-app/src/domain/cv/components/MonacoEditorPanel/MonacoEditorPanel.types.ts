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
}

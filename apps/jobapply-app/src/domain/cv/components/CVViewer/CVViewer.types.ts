/**
 * @file CVViewer.types.ts
 * @description Type definitions for the CVViewer component.
 */
import type { CV } from '../../types'

/** Props for the CVViewer component */
export interface CVViewerProps {
  /** The CV data to display */
  cv: CV
  /** Callback to switch to edit mode */
  onEdit: () => void
  /** Callback to delete the CV (with confirmation handled upstream) */
  onDelete: () => void
  /** Whether the viewport is in mobile mode */
  isMobile: boolean
}

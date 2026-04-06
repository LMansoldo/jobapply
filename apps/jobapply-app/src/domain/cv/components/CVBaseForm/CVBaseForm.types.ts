/**
 * @file CVBaseForm.types.ts
 * @description Type definitions for the CVBaseForm component.
 */
import type { FormInstance } from 'antd'
import type { CVCreatePayload } from '../../types'

/** Props for the CVBaseForm component */
export interface CVBaseFormProps {
  /** The form instance to use */
  form: FormInstance<CVCreatePayload>
  /** Whether the viewport is in mobile mode */
  isMobile: boolean
  /** Whether a CV already exists (enables the back button) */
  hasCv: boolean
  /** Whether a save operation is in progress */
  saving: boolean
  /** Current step label e.g. "Passo 1 de 3" */
  stepLabel?: string
  /** Callback to proceed to the next step */
  onNext: () => void
  /** Callback to go back to the viewer */
  onBack: () => void
}

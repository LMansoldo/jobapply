/**
 * @file tailoringHelpers.ts
 * @description Re-export dos helpers puros de mapping ATSReport → display, movidos para @jobapply/ats-ui.
 * Mantém os imports existentes do app funcionando sem alteração nos consumidores.
 */
export {
  buildEditorKeywords,
  buildSuggestionsList,
  mapATSReportToPanel,
  prependObjectiveSection,
} from '@jobapply/ats-ui'
export type { ATSPanelData, EditorKeywords } from '@jobapply/ats-ui'

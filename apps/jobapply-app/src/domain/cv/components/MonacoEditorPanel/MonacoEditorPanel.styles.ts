/**
 * @file MonacoEditorPanel.styles.ts
 * @description Style tokens for the MonacoEditorPanel component.
 */
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'

/** Style objects for the MonacoEditorPanel */
export const monacoEditorPanelStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap' as const,
    background: Colors.surfaceSubtle,
    border: `${Spacing.px} solid ${Colors.border}`,
    borderBottom: 'none',
    borderRadius: `${Spacing.sm2} ${Spacing.sm2} 0 0`,
    padding: `${Spacing.sm2} ${Spacing.md0}`,
  },
  toolbarDivider: {
    width: Spacing.px,
    height: Spacing.lg0,
    background: Colors.border,
    margin: `0 ${Spacing.xs}`,
  },
} as const

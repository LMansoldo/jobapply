/**
 * @file JobFilterBar.styles.ts
 * @description Style tokens for the JobFilterBar component.
 */
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'

/** Style objects for the JobFilterBar component */
export const jobFilterBarStyles = {
  container: {
    background: Colors.white,
    borderRadius: Spacing.sm,
    border: `${Spacing.px} solid ${Colors.borderCard}`,
    padding: `${Spacing.md1} ${Spacing.md}`,
    marginBottom: Spacing.md1,
    boxShadow: `0 1px 4px ${Colors.shadowXs}`,
  },
} as const

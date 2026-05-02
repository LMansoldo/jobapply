/**
 * @file JobDetail.styles.ts
 * @description Style tokens for the JobDetail component.
 */
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize } from '../../../../styles/theme/typography'

/** Style objects for the JobDetail component */
export const jobDetailStyles = {
  container: {
    padding: Spacing.lg,
  },
  tailoredBlock: {
    background: Colors.surfaceHighlight,
    border: `${Spacing.px} solid ${Colors.borderPurple}`,
    borderRadius: Spacing.sm,
    padding: `${Spacing.md1} ${Spacing.md}`,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg1,
    whiteSpace: 'pre-wrap' as const,
    fontSize: FontSize.md,
  },
  descriptionBlock: {
    marginTop: Spacing.sm,
    whiteSpace: 'pre-wrap' as const,
    fontSize: FontSize.md,
    color: Colors.textBody,
    lineHeight: '1.7',
  },
} as const

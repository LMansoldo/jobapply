/**
 * @file JobCard.styles.ts
 * @description Style tokens for the JobCard component.
 */
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize } from '../../../../styles/theme/typography'

/** Style objects for the JobCard component */
export const jobCardStyles = {
  cardSelected: {
    padding: `${Spacing.md2} ${Spacing.md}`,
    borderBottom: `${Spacing.px} solid ${Colors.borderList}`,
    borderLeft: `${Spacing.xxs} solid ${Colors.primary}`,
    background: Colors.surfaceSelected,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  cardDefault: {
    padding: `${Spacing.md2} ${Spacing.md}`,
    borderBottom: `${Spacing.px} solid ${Colors.borderList}`,
    borderLeft: `${Spacing.xxs} solid transparent`,
    background: Colors.white,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  titleText: {
    fontWeight: 600,
    color: Colors.primary,
    fontSize: FontSize.md,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    lineHeight: Spacing.lg1,
  },
  companyText: {
    fontSize: FontSize.md0,
    color: Colors.textSecondary,
    marginTop: Spacing.px,
  },
  locationText: {
    fontSize: FontSize.sm,
    color: Colors.textPlaceholder,
    marginTop: Spacing.px,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: Spacing.sm2,
    textAlign: 'right' as const,
  },
} as const

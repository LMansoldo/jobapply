import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  bar: {
    display: 'flex',
    gap: Spacing.xs,
    overflowX: 'auto' as const,
    scrollbarWidth: 'none' as const,
    paddingBottom: Spacing.xxs,
  },
  chip: {
    padding: `${Spacing.xxs} ${Spacing.md}`,
    borderRadius: BorderRadius.chip,
    fontSize: '1.3rem',
    fontWeight: FontWeight.medium,
    border: `1px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    color: Colors.textSub,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
    flexShrink: 0,
  },
  chipActive: {
    background: Colors.primaryLight,
    color: Colors.primaryDark,
    borderColor: Colors.primaryMid,
  },
}

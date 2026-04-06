import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  group: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: Spacing.xs,
  },
  chip: {
    padding: `${Spacing.xxs} ${Spacing.md}`,
    borderRadius: BorderRadius.full,
    fontSize: '1.3rem',
    fontWeight: FontWeight.medium,
    border: `1px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    color: Colors.textSub,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  },
  chipActive: {
    background: Colors.primaryDark,
    color: Colors.white,
    borderColor: Colors.primaryDark,
  },
}

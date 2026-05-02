import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  cloud: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: Spacing.xs,
  },
  tag: {
    padding: `${Spacing.xxs} ${Spacing.sm}`,
    borderRadius: BorderRadius.full,
    fontSize: '1.2rem',
    fontWeight: FontWeight.medium,
    border: `1px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    color: Colors.textSub,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  },
  tagActive: {
    background: Colors.primaryLight,
    color: Colors.primaryDark,
    borderColor: Colors.primaryMid,
  },
}

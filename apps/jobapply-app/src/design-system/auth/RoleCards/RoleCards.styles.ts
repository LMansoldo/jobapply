import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
    gap: Spacing.sm,
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: `${Spacing.lg} ${Spacing.md}`,
    borderRadius: BorderRadius.lg,
    border: `1.5px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    fontSize: '1.3rem',
    fontWeight: FontWeight.medium,
    color: Colors.textSub,
  },
  cardActive: {
    background: Colors.primaryLight,
    borderColor: Colors.primaryDark,
    color: Colors.primaryDark,
  },
  icon: {
    fontSize: '2.4rem',
  },
}

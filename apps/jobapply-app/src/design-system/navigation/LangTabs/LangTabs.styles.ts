import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  container: {
    display: 'inline-flex',
    background: Colors.surfaceBorder,
    borderRadius: BorderRadius.full,
    padding: '2px',
    gap: '2px',
  },
  tab: {
    padding: `${Spacing.xxs} ${Spacing.md}`,
    borderRadius: BorderRadius.full,
    fontSize: '1.3rem',
    fontWeight: FontWeight.medium,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: Colors.textSub,
    transition: 'background 0.15s, color 0.15s',
  },
  tabActive: {
    background: Colors.primaryDark,
    color: Colors.white,
  },
}

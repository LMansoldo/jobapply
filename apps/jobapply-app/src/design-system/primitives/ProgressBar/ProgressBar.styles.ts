import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'
import { FontWeight } from '../../../styles/theme/typography'

export const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.xxs,
  },
  track: {
    width: '100%',
    height: '0.8rem',
    background: Colors.surfaceBorder,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: Colors.gradientProgressBar,
    borderRadius: BorderRadius.full,
    transition: 'width 0.4s ease',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: FontWeight.medium,
    color: Colors.textSub,
  },
}

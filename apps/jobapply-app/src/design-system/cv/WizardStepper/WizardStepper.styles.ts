import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  stepper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.xs,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: `${Spacing.sm} ${Spacing.md}`,
    borderRadius: BorderRadius.md,
    cursor: 'default',
    transition: 'background 0.15s',
  },
  stepDefault: {
    background: 'transparent',
  },
  stepActive: {
    background: Colors.primaryLight,
  },
  circle: {
    width: '2.8rem',
    height: '2.8rem',
    borderRadius: BorderRadius.avatar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.3rem',
    flexShrink: 0,
    transition: 'background 0.15s, color 0.15s',
  },
  circleDefault: {
    background: Colors.surfaceBorder,
    color: Colors.textSub,
  },
  circleActive: {
    background: Colors.primaryDark,
    color: Colors.white,
  },
  circleDone: {
    background: Colors.success,
    color: Colors.white,
  },
  label: {
    fontSize: '1.3rem',
    fontWeight: FontWeight.medium,
  },
  labelDefault: {
    color: Colors.textSub,
  },
  labelActive: {
    color: Colors.primaryDark,
    fontWeight: FontWeight.semibold,
  },
}

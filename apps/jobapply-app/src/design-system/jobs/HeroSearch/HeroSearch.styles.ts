import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    background: Colors.white,
    borderRadius: BorderRadius.full,
    boxShadow: Shadows.heroSearch,
    padding: `${Spacing.xs} ${Spacing.xs} ${Spacing.xs} ${Spacing.lg}`,
    gap: Spacing.xs,
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  input: {
    border: 'none',
    background: 'transparent',
    fontSize: '1.4rem',
    color: Colors.textMain,
    outline: 'none',
    width: '100%',
    padding: `${Spacing.xs} 0`,
  },
  divider: {
    width: '1px',
    height: '2.4rem',
    background: Colors.surfaceBorder,
    flexShrink: 0,
  },
  icon: {
    color: Colors.textSub,
    flexShrink: 0,
    fontSize: '1.6rem',
  },
  btn: {
    borderRadius: BorderRadius.full,
    border: 'none',
    background: Colors.gradientTailorBtn,
    color: Colors.white,
    fontWeight: 600,
    fontSize: '1.4rem',
    padding: `${Spacing.sm} ${Spacing.lg}`,
    cursor: 'pointer',
    flexShrink: 0,
    height: '4rem',
  },
}

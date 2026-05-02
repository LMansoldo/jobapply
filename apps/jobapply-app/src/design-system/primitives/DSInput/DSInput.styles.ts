import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  wrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute' as const,
    left: Spacing.md,
    zIndex: 1,
    color: Colors.textSub,
    pointerEvents: 'none' as const,
    display: 'flex',
    alignItems: 'center',
  },
  inputBase: {
    borderRadius: BorderRadius.sm,
    background: Colors.surfacePage,
    border: `1px solid ${Colors.surfaceBorder}`,
    fontSize: '1.4rem',
    height: '4.4rem',
    transition: 'background 0.15s, border-color 0.15s',
  },
  inputFilled: {
    background: Colors.white,
  },
}

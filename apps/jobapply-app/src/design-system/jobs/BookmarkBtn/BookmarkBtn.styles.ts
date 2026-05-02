import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  btn: {
    width: '3.2rem',
    height: '3.2rem',
    borderRadius: BorderRadius.sm,
    border: `1px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
    padding: Spacing.xxs,
    flexShrink: 0,
  },
  btnSaved: {
    borderColor: Colors.primaryDark,
    color: Colors.primaryDark,
  },
  btnUnsaved: {
    color: Colors.textSub,
  },
}

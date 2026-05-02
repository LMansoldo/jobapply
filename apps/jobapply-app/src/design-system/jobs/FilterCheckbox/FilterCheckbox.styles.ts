import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    cursor: 'pointer',
    userSelect: 'none' as const,
    padding: `${Spacing.xxs} 0`,
  },
  checkbox: {
    width: '1.6rem',
    height: '1.6rem',
    borderRadius: BorderRadius.xs,
    border: `1.5px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s, border-color 0.15s',
  },
  checkboxChecked: {
    background: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  checkmark: {
    color: Colors.white,
    fontSize: '1.0rem',
  },
  label: {
    fontSize: '1.3rem',
    color: Colors.textMain,
    flex: 1,
  },
  count: {
    fontSize: '1.2rem',
    color: Colors.textSub,
    background: Colors.surfacePage,
    borderRadius: BorderRadius.full,
    padding: '0 0.6rem',
    fontWeight: FontWeight.medium,
  },
}

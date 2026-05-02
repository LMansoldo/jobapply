import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  bar: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    background: Colors.gradientAiToolbar,
    border: `1px solid ${Colors.surfaceBorder}`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  icon: {
    fontSize: '1.6rem',
    color: Colors.primary,
    flexShrink: 0,
    marginTop: '2px',
  },
  text: {
    flex: 1,
    fontSize: '1.3rem',
    color: Colors.textMain,
    lineHeight: 1.5,
  },
  btn: {
    flexShrink: 0,
    border: `1px solid ${Colors.primaryMid}`,
    background: 'transparent',
    color: Colors.primaryDark,
    fontSize: '1.2rem',
    fontWeight: FontWeight.medium,
    borderRadius: BorderRadius.full,
    padding: `${Spacing.xxs} ${Spacing.sm}`,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
}

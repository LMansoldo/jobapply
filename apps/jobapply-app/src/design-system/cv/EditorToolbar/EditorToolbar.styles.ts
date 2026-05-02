import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'
import { FontWeight } from '../../../styles/theme/typography'

export const styles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: Colors.surfaceDarker,
    padding: `${Spacing.xs} ${Spacing.sm}`,
    borderRadius: `${BorderRadius.base} ${BorderRadius.base} 0 0`,
    flexWrap: 'wrap' as const,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: Spacing.xxs,
    padding: `${Spacing.xxs} ${Spacing.sm}`,
    borderRadius: BorderRadius.xs,
    border: 'none',
    background: 'transparent',
    color: Colors.textSub,
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    height: '2.8rem',
  },
  btnActive: {
    background: 'rgba(124,58,237,0.2)',
    color: Colors.primary,
  },
  btnWide: {
    padding: `${Spacing.xxs} ${Spacing.md}`,
    fontWeight: FontWeight.medium,
  },
  divider: {
    width: '1px',
    height: '1.8rem',
    background: 'rgba(255,255,255,0.1)',
    margin: `0 ${Spacing.xxs}`,
    flexShrink: 0,
  },
}

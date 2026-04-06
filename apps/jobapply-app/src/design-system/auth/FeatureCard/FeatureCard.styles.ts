import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    display: 'flex',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: '4rem',
    height: '4rem',
    borderRadius: BorderRadius.chip,
    background: 'rgba(167,139,250,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: Colors.primary,
    flexShrink: 0,
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  title: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.4rem',
    color: Colors.white,
    margin: 0,
  },
  description: {
    fontSize: '1.3rem',
    color: 'rgba(255,255,255,0.65)',
    margin: 0,
    lineHeight: 1.5,
  },
}

import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

export const styles = {
  panel: {
    background: Colors.white,
    borderRadius: BorderRadius.base,
    boxShadow: Shadows.sm,
    padding: Spacing.lg,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.lg,
  },
  scoreCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.3rem',
    color: Colors.textSub,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginBottom: Spacing.sm,
  },
  keywordList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  divider: {
    height: '1px',
    background: Colors.surfaceBorder,
  },
}

import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'
import { FontFamily, FontWeight, LetterSpacing } from '../../../styles/theme/typography'

export const styles = {
  card: {
    background: Colors.white,
    borderRadius: BorderRadius.base,
    border: `1px solid ${Colors.surfaceBorder}`,
    boxShadow: Shadows.sm,
    padding: Spacing.lg,
    transition: 'box-shadow 0.2s ease',
  },
  cardHoverable: {
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.1rem',
    letterSpacing: LetterSpacing.label,
    textTransform: 'uppercase' as const,
    color: Colors.textSub,
  },
}

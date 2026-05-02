import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

export const styles = {
  card: {
    background: Colors.white,
    borderRadius: BorderRadius.base,
    boxShadow: Shadows.sm,
    overflow: 'hidden',
  },
  header: {
    padding: `${Spacing.md} ${Spacing.lg}`,
    borderBottom: `1px solid ${Colors.surfaceBorder}`,
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.5rem',
    color: Colors.textMain,
  },
  body: {
    padding: Spacing.lg,
  },
}

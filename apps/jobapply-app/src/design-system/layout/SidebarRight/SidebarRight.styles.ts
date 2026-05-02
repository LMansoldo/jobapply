import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  sidebar: {
    background: Colors.white,
    borderRadius: BorderRadius.base,
    boxShadow: Shadows.sm,
    padding: Spacing.lg,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.md,
  },
}

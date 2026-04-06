import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  wrapper: {
    background: Colors.primaryLight,
    borderLeft: `3px solid ${Colors.primaryDark}`,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
}

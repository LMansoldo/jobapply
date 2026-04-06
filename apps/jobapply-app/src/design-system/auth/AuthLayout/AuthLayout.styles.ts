import { Colors } from '../../../styles/theme/colors'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: Colors.pageBg,
  },
  leftPanel: {
    flex: '0 0 45%',
    background: Colors.gradientHeroDark,
    padding: Spacing.xxl,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    boxShadow: Shadows.auth,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  formCard: {
    background: Colors.white,
    borderRadius: '1.6rem',
    boxShadow: Shadows.lg,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: '42rem',
  },
}

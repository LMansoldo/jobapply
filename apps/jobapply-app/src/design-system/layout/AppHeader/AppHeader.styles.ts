import { Colors } from '../../../styles/theme/colors'
import { Shadows } from '../../../styles/theme/shadows'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    background: Colors.white,
    boxShadow: Shadows.sm,
    height: '6rem',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${Spacing.lg}`,
    gap: Spacing.lg,
  },
  logo: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    fontSize: '2.0rem',
    color: Colors.primaryDark,
    textDecoration: 'none',
    marginRight: Spacing.lg,
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  navLink: {
    fontFamily: FontFamily.body,
    fontWeight: FontWeight.medium,
    fontSize: '1.4rem',
    color: Colors.textSub,
    textDecoration: 'none',
    padding: `${Spacing.xs} ${Spacing.sm}`,
    borderRadius: '6px',
    transition: 'color 0.15s, background 0.15s',
  },
  navLinkActive: {
    color: Colors.primaryDark,
    background: Colors.primaryLight,
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
  },
}

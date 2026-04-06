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
    height: '6.4rem',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${Spacing.lg}`,
    gap: Spacing.md,
  },
  logo: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    fontSize: '2.0rem',
    textDecoration: 'none',
    marginRight: Spacing.md,
    flexShrink: 0,
    letterSpacing: '-0.5px',
  },
  logoJob: {
    color: Colors.textMain,
  },
  logoBoard: {
    color: Colors.primaryDark,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  navLink: {
    fontFamily: FontFamily.body,
    fontWeight: FontWeight.medium,
    fontSize: '1.1rem',
    color: Colors.textSub,
    textDecoration: 'none',
    padding: `${Spacing.sm2} ${Spacing.sm}`,
    borderRadius: '8px',
    transition: 'color 0.15s, background 0.15s',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    minWidth: '5.6rem',
    letterSpacing: '0.2px',
  },
  navLinkActive: {
    color: Colors.primaryDark,
    background: Colors.primaryLight,
  },
  navIcon: {
    fontSize: '1.7rem',
    lineHeight: 1,
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  publishBtn: {
    background: Colors.primaryDark,
    color: Colors.white,
    border: 'none',
    borderRadius: '20px',
    padding: `${Spacing.sm} ${Spacing.lg}`,
    fontFamily: FontFamily.body,
    fontWeight: FontWeight.semibold,
    fontSize: '1.3rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'background 0.15s',
  },
}

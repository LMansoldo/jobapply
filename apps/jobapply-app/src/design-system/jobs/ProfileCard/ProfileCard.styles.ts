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
  banner: {
    height: '8rem',
    background: Colors.gradientProfileBanner,
  },
  body: {
    padding: `0 ${Spacing.lg} ${Spacing.lg}`,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.sm,
  },
  avatarWrapper: {
    marginTop: '-2.8rem',
    marginBottom: Spacing.xs,
  },
  avatar: {
    width: '5.6rem',
    height: '5.6rem',
    borderRadius: BorderRadius.avatar,
    background: Colors.primaryDark,
    border: `3px solid ${Colors.white}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    fontSize: '2.0rem',
    color: Colors.white,
    boxShadow: Shadows.avatar,
  },
  name: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.5rem',
    color: Colors.textMain,
    margin: 0,
  },
  email: {
    fontSize: '1.2rem',
    color: Colors.textSub,
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelText: {
    fontSize: '1.2rem',
    color: Colors.textSub,
  },
  progressLabelValue: {
    fontSize: '1.2rem',
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
}

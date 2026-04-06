import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

export const styles = {
  wrapper: {
    position: 'relative' as const,
    display: 'inline-flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.8rem',
  },
  avatar: {
    width: '9.6rem',
    height: '9.6rem',
    borderRadius: BorderRadius.avatar,
    background: Colors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    fontSize: '3.2rem',
    color: Colors.primaryDark,
    overflow: 'hidden',
    boxShadow: Shadows.avatar,
    cursor: 'pointer',
    position: 'relative' as const,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  overlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.avatar,
    opacity: 0,
    transition: 'opacity 0.2s',
    color: Colors.white,
    fontSize: '2rem',
  },
  input: {
    display: 'none',
  },
  hint: {
    fontSize: '1.2rem',
    color: Colors.textSub,
  },
}

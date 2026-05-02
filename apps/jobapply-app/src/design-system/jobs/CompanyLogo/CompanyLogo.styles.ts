import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

export const getStyles = (size: number) => ({
  wrapper: {
    width: size,
    height: size,
    borderRadius: BorderRadius.logo,
    background: Colors.primaryLight,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  initials: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    fontSize: `${size * 0.35}px`,
    color: Colors.primaryDark,
    textTransform: 'uppercase' as const,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
})

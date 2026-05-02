import { css, keyframes } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography'

const BADGE_SIZE = '3.6rem'
const FEATURED_ACCENT_HEIGHT = '0.4rem'

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(0.8rem); }
  to   { opacity: 1; transform: translateY(0); }
`

export const dismissBtn = css({
  position: 'absolute',
  top: Spacing.sm,
  right: Spacing.sm,
  background: 'none',
  border: 'none',
  color: Colors.textSub,
  cursor: 'pointer',
  fontSize: FontSize.md,
  lineHeight: 1,
  padding: `${Spacing.xxs} ${Spacing.xs}`,
  borderRadius: BorderRadius.xs,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.15s, color 0.15s, background 0.15s',
  '&:hover': {
    color: Colors.danger,
    background: Colors.dangerBg,
  },
})

export const card = (isSelected: boolean, index: number) => css({
  background: isSelected ? Colors.primaryLight : Colors.white,
  borderRadius: isSelected ? `0 ${BorderRadius.base} ${BorderRadius.base} 0` : BorderRadius.base,
  border: `1px solid ${isSelected ? Colors.primaryMid : Colors.surfaceBorder}`,
  borderLeft: isSelected ? `3px solid ${Colors.primary}` : `1px solid ${Colors.surfaceBorder}`,
  boxShadow: isSelected ? Shadows.md : Shadows.sm,
  padding: Spacing.lg,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  position: 'relative',
  animation: `${fadeInUp} 0.3s ease both`,
  animationDelay: `${index * 0.04}s`,
  '&:hover': {
    boxShadow: Shadows.md,
  },
  [`&:hover .${dismissBtn}`]: {
    opacity: 1,
  },
})

export const cardFeaturedAccent = css({
  height: FEATURED_ACCENT_HEIGHT,
  background: Colors.gradientTailorBtn,
  borderRadius: `${BorderRadius.base} ${BorderRadius.base} 0 0`,
  margin: `-${Spacing.lg} -${Spacing.lg} 0`,
})

export const coMark = (color: string) => css({
  width: BADGE_SIZE,
  height: BADGE_SIZE,
  borderRadius: BorderRadius.sm,
  background: `${color}1a`,
  border: `1px solid ${color}66`,
  color,
  fontSize: FontSize.md0,
  fontWeight: FontWeight.bold,
  fontFamily: FontFamily.heading,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  userSelect: 'none',
  textTransform: 'uppercase',
})

export const top = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.md,
})

export const titleGroup = css({
  flex: 1,
  minWidth: 0,
})

export const title = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.md2,
  color: Colors.textMain,
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const company = css({
  fontSize: FontSize.xs,
  color: Colors.textSub,
  marginTop: '2px',
})

export const meta = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: Spacing.xs,
  alignItems: 'center',
})

export const metaText = css({
  fontSize: FontSize.xs,
  color: Colors.textSub,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xxs,
})

export const tags = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: Spacing.xs,
})

export const footer = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: Spacing.xs,
})

export const salary = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
})

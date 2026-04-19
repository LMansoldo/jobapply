import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const MOBILE = '@media (max-width: 767px)'
const TINY = '@media (max-width: 374px)'

export const root = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: `${Spacing.lg} 0`,
  gap: 0,
  [MOBILE]: {
    padding: `${Spacing.md} ${Spacing.xl}`,
  },
  [TINY]: {
    padding: `${Spacing.sm} ${Spacing.md}`,
  },
})

export const stepOuter = (isLast: boolean) => css({
  display: 'flex',
  alignItems: 'flex-start',
  flex: isLast ? 0 : 1,
})

export const stepInner = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: Spacing.xs,
  flexShrink: 0,
})

export const circle = (state: 'done' | 'active' | 'inactive', clickable: boolean) => css({
  width: '3.6rem',
  height: '3.6rem',
  [MOBILE]: {
    width: '2.8rem',
    height: '2.8rem',
    fontSize: FontSize.xxs,
  },
  [TINY]: {
    width: '2.4rem',
    height: '2.4rem',
    fontSize: FontSize.xxs,
  },
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: FontSize.sm,
  transition: 'all 0.2s',
  cursor: clickable ? 'pointer' : 'default',
  border: 'none',
  padding: 0,
  flexShrink: 0,
  ...(state === 'done'
    ? { background: Colors.primaryDark, color: Colors.white }
    : state === 'active'
      ? { background: Colors.primaryDark, color: Colors.white, boxShadow: `0 0 0 4px ${Colors.primaryLight}` }
      : { background: Colors.white, color: Colors.textSub, border: `2px solid ${Colors.surfaceBorder}` }),
  ...(clickable && state !== 'inactive' && {
    '&:hover': { opacity: 0.85 },
  }),
})

export const checkIcon = css({
  fontSize: FontSize.md,
})

export const labelWrapper = css({
  textAlign: 'center',
})

export const stepLabel = (isActive: boolean, isDone: boolean) => css({
  margin: 0,
  fontSize: FontSize.sm,
  fontWeight: isActive ? FontWeight.semibold : FontWeight.regular,
  color: isActive ? Colors.primaryDark : isDone ? Colors.textMain : Colors.textSub,
  whiteSpace: 'nowrap',
  [MOBILE]: {
    fontSize: FontSize.xxs,
    whiteSpace: 'normal',
    maxWidth: '7rem',
    textAlign: 'center',
  },
  [TINY]: {
    maxWidth: '5.6rem',
    fontSize: '0.9rem',
  },
})

export const stepSublabel = css({
  margin: 0,
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  [MOBILE]: {
    display: 'none',
  },
})

export const connector = (isDone: boolean) => css({
  flex: 1,
  height: '2px',
  marginTop: '1.7rem',
  background: isDone ? Colors.primaryDark : Colors.surfaceBorder,
  transition: 'background 0.2s',
  [MOBILE]: {
    marginTop: '1.3rem',
  },
  [TINY]: {
    marginTop: '1.1rem',
  },
})

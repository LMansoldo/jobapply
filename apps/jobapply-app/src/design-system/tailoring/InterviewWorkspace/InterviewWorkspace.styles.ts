import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const SIDE_WIDTH = '30rem'

export const grid = css({
  display: 'grid',
  gridTemplateColumns: `1fr ${SIDE_WIDTH}`,
  gap: 0,
  height: '100%',
  minHeight: '40rem',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
})

export const storiesPane = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  padding: Spacing.lg,
  overflowY: 'auto',
})

export const storiesTitle = css({
  margin: 0,
  fontSize: FontSize.md,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.heading,
})

export const storyCard = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  padding: Spacing.lg,
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
})

export const storyRequirement = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.body,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

export const storyText = css({
  margin: 0,
  fontSize: FontSize.sm,
  color: Colors.textMain,
  fontFamily: FontFamily.body,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
})

export const sidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  background: Colors.surfacePage,
  '@media (max-width: 768px)': {
    borderLeft: 'none',
    borderTop: `1px solid ${Colors.surfaceBorder}`,
  },
})

export const positioningCard = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  padding: Spacing.lg,
  background: Colors.primaryLight,
  border: `1px solid ${Colors.primaryMid}`,
})

export const positioningTitle = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.heading,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const positioningText = css({
  margin: 0,
  fontSize: FontSize.sm,
  color: Colors.textMain,
  fontFamily: FontFamily.body,
  lineHeight: 1.7,
})

export const emptyState = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.lg,
  padding: Spacing.xxl,
  color: Colors.textSub,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
})

export const generateBtn = css({
  padding: `${Spacing.sm} ${Spacing.xl}`,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.88 },
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
})

export const regenBtn = css({
  width: '100%',
  padding: `${Spacing.sm} 0`,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.88 },
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
})

import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily, LineHeight } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { mediaQueries } from '../../../../styles/theme/breakpoints'

export const root = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.xl,
  padding: Spacing.xxl,
  minHeight: '40rem',
  [mediaQueries.tabletDown]: { padding: Spacing.lg },
})

export const card = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: Spacing.lg,
  padding: Spacing.xl,
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  maxWidth: '44rem',
  width: '100%',
})

export const linkedinIcon = css({
  fontSize: '4rem',
  color: Colors.socialLinkedin,
})

export const title = css({
  margin: 0,
  fontSize: FontSize.lg,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.heading,
  color: Colors.textMain,
  textAlign: 'center',
})

export const subtitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
  lineHeight: LineHeight.relaxed,
  textAlign: 'center',
})

export const connectedBadge = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  padding: `${Spacing.xs} ${Spacing.md}`,
  background: Colors.successBg,
  color: Colors.success,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
})

export const connectBtn = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  width: '100%',
  padding: `${Spacing.md} ${Spacing.xl}`,
  background: Colors.socialLinkedin,
  color: Colors.white,
  border: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.md,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  justifyContent: 'center',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.88 },
})

export const analyzeBtn = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  width: '100%',
  padding: `${Spacing.md} ${Spacing.xl}`,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.md,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  justifyContent: 'center',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.88 },
})

export const divider = css({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderTop: `1px solid ${Colors.surfaceBorder}`,
  },
  fontSize: FontSize.xs,
  color: Colors.textSub,
  fontFamily: FontFamily.body,
})

export const pdfBtn = css({
  width: '100%',
  padding: `${Spacing.sm} 0`,
  background: 'transparent',
  color: Colors.primaryDark,
  border: `1px solid ${Colors.primaryMid}`,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.7 },
})

import { css } from '@emotion/css'
import { Colors } from '../../styles/theme/colors'
import { FontFamily, FontWeight, FontSize } from '../../styles/theme/typography'
import { Spacing } from '../../styles/theme/spacing'

export const leftPanelRoot = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.lg,
})

export const leftHeadline = css({
  fontFamily: FontFamily.heading,
  color: Colors.white,
  fontSize: '3.2rem',
  margin: '0 0 0.8rem',
  fontWeight: FontWeight.bold,
  lineHeight: 1.15,
})

export const leftSubtitle = css({
  color: 'rgba(255,255,255,0.65)',
  fontSize: FontSize.base,
  margin: 0,
  lineHeight: 1.6,
})

export const leftFeatures = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const rightPanelRoot = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const rightHeadingRow = css({
  marginBottom: Spacing.xs,
})

export const rightTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: '2.2rem',
  color: Colors.textMain,
  margin: '0 0 0.4rem',
  fontWeight: FontWeight.bold,
})

export const rightSubtitle = css({
  color: Colors.textSub,
  fontSize: FontSize.base,
  margin: 0,
})

export const loginLink = css({
  color: Colors.primaryDark,
  fontWeight: FontWeight.semibold,
})

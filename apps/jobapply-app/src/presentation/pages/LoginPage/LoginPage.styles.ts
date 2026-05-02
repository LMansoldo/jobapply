import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontWeight, FontSize } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { mediaQueries } from '../../../styles/theme/breakpoints'

export const leftPanelRoot = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.lg,
})

export const leftHeadline = css({
  fontFamily: FontFamily.heading,
  color: Colors.white,
  fontSize: FontSize.h3,
  margin: `0 0 ${Spacing.sm}`,
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
  width: '100%',
})

export const rightHeadingRow = css({
  marginBottom: Spacing.sm,
})

export const rightTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: FontSize.xl,
  color: Colors.textMain,
  margin: `0 0 ${Spacing.xs}`,
  fontWeight: FontWeight.bold,

  [mediaQueries.md]: {
    fontSize: FontSize.xxl,
  },
})

export const rightSubtitle = css({
  color: Colors.textSub,
  fontSize: FontSize.base,
  margin: 0,
})

export const registerLink = css({
  color: Colors.primaryDark,
  fontWeight: FontWeight.semibold,
})

export const socialBtns = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const demoBox = css({
  background: Colors.surfaceCode,
  borderRadius: BorderRadius.sm,
  padding: `${Spacing.sm} ${Spacing.md}`,
})

export const fullWidthBtn = css({
  '& button': {
    width: '100%',
  },
})

export const formItemSpacing = css({
  '&.ant-form-item': {
    marginBottom: Spacing.md,
  },
})

export const formItemSmSpacing = css({
  '&.ant-form-item': {
    marginBottom: Spacing.sm,
  },
})

export const dividerOr = css({
  '& .ant-divider-inner-text': {
    color: Colors.textSub,
    fontSize: FontSize.sm,
  },
})

export const demoText = css({
  color: Colors.textSub,
  fontSize: FontSize.sm,
})

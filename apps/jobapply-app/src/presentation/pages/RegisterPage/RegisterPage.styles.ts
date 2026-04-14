import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontWeight, FontSize } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
// BorderRadius not yet needed but imported for future consistency

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
})

export const rightHeadingRow = css({
  marginBottom: Spacing.xs,
})

export const rightTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: FontSize.xxl,
  color: Colors.textMain,
  margin: `0 0 ${Spacing.xs}`,
  fontWeight: FontWeight.bold,
})

export const formItemSpacing = css({
  '&.ant-form-item': {
    marginTop: Spacing.sm,
  },
})

export const formItemSubmit = css({
  '&.ant-form-item': {
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
})

export const fullWidthBtn = css({
  '& button': {
    width: '100%',
  },
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

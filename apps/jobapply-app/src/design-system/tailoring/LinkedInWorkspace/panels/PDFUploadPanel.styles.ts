import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily, LineHeight } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'

export const root = css({
  display: 'flex',
  justifyContent: 'center',
  padding: `${Spacing.xxl} ${Spacing.lg}`,
  minHeight: '40rem',
})

export const inner = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xl,
  maxWidth: '52rem',
  width: '100%',
})

export const header = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const title = css({
  margin: 0,
  fontSize: FontSize.lg,
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
})

export const subtitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
  lineHeight: LineHeight.relaxed,
})

export const tutorial = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  padding: Spacing.lg,
  background: Colors.primaryLight,
  border: `1px solid ${Colors.primaryMid}`,
})

export const tutorialTitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
})

export const steps = css({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const step = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.md,
})

export const stepNumber = css({
  flexShrink: 0,
  width: '2.4rem',
  height: '2.4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: Colors.primaryDark,
  color: Colors.white,
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.bold,
})

export const stepContent = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
})

export const stepTitle = css({
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
})

export const stepDesc = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
  lineHeight: LineHeight.relaxed,
})

export const dropzone = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.sm,
  padding: Spacing.xl,
  border: `2px dashed ${Colors.primaryMid}`,
  background: Colors.white,
  cursor: 'pointer',
  transition: 'background 0.15s',
  '&:hover': { background: Colors.primaryLight },
})

export const dropzoneActive = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.sm,
  padding: Spacing.xl,
  border: `2px dashed ${Colors.primaryDark}`,
  background: Colors.primaryMid,
  cursor: 'pointer',
})

export const dropIcon = css({
  fontSize: '3.2rem',
  color: Colors.primaryDark,
})

export const dropText = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.primaryDark,
  fontWeight: FontWeight.medium,
  textAlign: 'center',
  lineHeight: LineHeight.relaxed,
})

export const fileChosen = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  padding: `${Spacing.sm} ${Spacing.md}`,
  background: Colors.successBg,
  border: `1px solid ${Colors.success}`,
  width: '100%',
})

export const fileSuccessIcon = css({
  color: Colors.success,
  flexShrink: 0,
})

export const fileName = css({
  flex: 1,
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const analyzeBtn = css({
  width: '100%',
  padding: `${Spacing.md} 0`,
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

import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily, LineHeight } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'

export const root = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '40rem',
  padding: `${Spacing.xxl} ${Spacing.lg}`,
})

export const card = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.lg,
  maxWidth: '56rem',
  width: '100%',
})

export const headline = css({
  margin: 0,
  fontSize: FontSize.xl,
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  lineHeight: LineHeight.tight,
})

export const subtext = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
  lineHeight: LineHeight.relaxed,
})

export const textarea = css({
  width: '100%',
  minHeight: '14rem',
  padding: Spacing.md,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  color: Colors.textMain,
  background: Colors.white,
  border: `1.5px solid ${Colors.surfaceBorder}`,
  resize: 'vertical',
  lineHeight: LineHeight.relaxed,
  outline: 'none',
  transition: 'border-color 0.15s',
  '&:focus': { borderColor: Colors.primaryDark },
  '&::placeholder': { color: Colors.textMuted ?? Colors.textSub, opacity: 0.7 },
})

export const actions = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const nextBtn = css({
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
})

export const skipRow = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: Spacing.xs,
})

export const skipBtn = css({
  background: 'none',
  border: 'none',
  color: Colors.textSub,
  fontFamily: FontFamily.body,
  fontSize: FontSize.xs,
  cursor: 'pointer',
  textDecoration: 'underline',
  '&:hover': { color: Colors.textMain },
})

export const skipWarning = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.warning,
  textAlign: 'center',
  lineHeight: LineHeight.relaxed,
})

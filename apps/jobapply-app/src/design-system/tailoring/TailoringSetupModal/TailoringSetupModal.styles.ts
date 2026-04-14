import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export const setupSteps = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  marginBottom: Spacing.lg,
})

export const setupStepDot = (active: boolean) => css({
  width: '2.4rem',
  height: '2.4rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  flexShrink: 0,
  background: active ? Colors.primaryDark : Colors.surfaceBorder,
  color: active ? Colors.white : Colors.textSub,
  transition: 'background 0.2s',
})

export const setupStepLine = css({
  flex: 1,
  height: '1px',
  background: Colors.surfaceBorder,
})

export const setupStepLabel = (active: boolean) => css({
  fontSize: FontSize.xxs,
  color: active ? Colors.primaryDark : Colors.textSub,
  fontWeight: active ? FontWeight.semibold : FontWeight.regular,
  flexShrink: 0,
})

export const setupSectionTitle = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  margin: `0 0 ${Spacing.sm}`,
})

export const setupLocaleRow = css({
  display: 'flex',
  gap: Spacing.md,
  marginTop: Spacing.sm,
})

export const setupLocaleBtn = (active: boolean) => css({
  flex: 1,
  padding: `${Spacing.md} ${Spacing.lg}`,
  border: `2px solid ${active ? Colors.primaryDark : Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  background: active ? Colors.primaryLight : Colors.white,
  color: active ? Colors.primaryDark : Colors.textMain,
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  textAlign: 'center' as const,
  transition: 'all 0.15s',
  ':hover': { borderColor: Colors.primaryDark, background: Colors.primaryLight },
})

export const setupTip = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  background: 'rgba(245,158,11,0.08)',
  border: '1px solid rgba(245,158,11,0.3)',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.md}`,
  marginBottom: Spacing.md,
})

export const setupTipText = css({
  fontSize: FontSize.sm,
  color: Colors.orange,
  lineHeight: '1.5',
  margin: 0,
})

export const setupJdTextarea = css({
  width: '100%',
  minHeight: '22rem',
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  padding: Spacing.md,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  lineHeight: '1.6',
  color: Colors.textMain,
  outline: 'none',
  resize: 'vertical' as const,
  boxSizing: 'border-box' as const,
  ':focus': { borderColor: Colors.primaryDark },
})

export const setupModalFooter = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: Spacing.lg,
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  marginTop: Spacing.lg,
})
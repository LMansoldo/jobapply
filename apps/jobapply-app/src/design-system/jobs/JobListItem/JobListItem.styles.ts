import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const item = (selected: boolean) => css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  padding: `${Spacing.md} ${Spacing.md}`,
  cursor: 'pointer',
  borderLeft: `3px solid ${selected ? Colors.primaryDark : 'transparent'}`,
  background: selected ? Colors.surfaceHighlight : Colors.white,
  transition: 'background 0.15s, border-color 0.15s',
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  position: 'relative',
  '&:hover': {
    background: selected ? Colors.surfaceHighlight : Colors.surfacePage,
  },
})

export const logoWrap = css({
  flexShrink: 0,
  marginTop: '2px',
})

export const content = css({
  flex: 1,
  minWidth: 0,
})

export const title = (selected: boolean) => css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  color: selected ? Colors.primaryDark : Colors.primaryDark,
  margin: '0 0 2px',
  lineHeight: 1.35,
  paddingRight: Spacing.lg,
})

export const company = css({
  fontSize: FontSize.xs,
  color: Colors.textMain,
  margin: '0 0 1px',
  fontWeight: FontWeight.medium,
})

export const location = css({
  fontSize: FontSize.xs,
  color: Colors.textSub,
  margin: 0,
})

export const meta = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  marginTop: '4px',
  flexWrap: 'wrap' as const,
})

export const timeLabel = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
})

export const viewedLabel = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
})

export const hotBadge = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.orange,
  background: Colors.orangeBg,
  borderRadius: '8px',
  padding: `1px 6px`,
})

export const newBadge = css({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.success,
  background: Colors.successBg,
  borderRadius: '8px',
  padding: `1px 6px`,
})

export const dismissBtn = css({
  position: 'absolute',
  top: Spacing.sm,
  right: Spacing.sm,
  background: 'none',
  border: 'none',
  color: Colors.textSub,
  cursor: 'pointer',
  fontSize: '1.4rem',
  lineHeight: 1,
  padding: '2px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.4,
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 1 },
})

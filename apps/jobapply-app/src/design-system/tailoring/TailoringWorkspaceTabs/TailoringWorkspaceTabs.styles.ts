import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { mediaQueries } from '../../../styles/theme/breakpoints'

export const workspaceTabs = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `0 ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  flexShrink: 0,
  [mediaQueries.mobileOnly]: {
    display: 'none',
  },
})

export const mobileDropdownWrapper = css({
  display: 'none',
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.xs} ${Spacing.md}`,
  flexShrink: 0,
  [mediaQueries.mobileOnly]: {
    display: 'flex',
  },
})

export const mobileDropdownTrigger = css({
  padding: `${Spacing.xs} ${Spacing.md}`,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: '6px',
  background: Colors.white,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  whiteSpace: 'nowrap',
})

export const tabBtn = (active: boolean) => css({
  padding: `${Spacing.sm} ${Spacing.md}`,
  border: 'none',
  background: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: active ? Colors.primaryDark : Colors.textSub,
  cursor: 'pointer',
  borderBottom: `2px solid ${active ? Colors.primary : 'transparent'}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  whiteSpace: 'nowrap',
  transition: 'color .15s, border-color .15s',
})

export const dropdownItemContent = (active: boolean) => css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: active ? Colors.primaryDark : Colors.textSub,
  whiteSpace: 'nowrap',
})

export const tabBadge = (bg: string, color: string) => css({
  background: bg,
  color,
  borderRadius: '10px',
  padding: `0 ${Spacing.xs}`,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
})

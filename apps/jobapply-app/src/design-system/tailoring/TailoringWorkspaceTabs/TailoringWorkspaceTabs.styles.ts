import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const workspaceTabs = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `0 ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  flexShrink: 0,
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

export const tabBadge = (bg: string, color: string) => css({
  background: bg,
  color,
  borderRadius: '10px',
  padding: `0 ${Spacing.xs}`,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
})
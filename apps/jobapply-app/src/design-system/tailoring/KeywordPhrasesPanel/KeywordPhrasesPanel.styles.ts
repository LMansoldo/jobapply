import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const PANEL_MAX_HEIGHT = '32rem'

export const container = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  padding: `${Spacing.md} ${Spacing.lg}`,
  borderTop: `1px solid ${Colors.surfaceBorder}`,
})

export const sectionLabel = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.heading,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const list = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  maxHeight: PANEL_MAX_HEIGHT,
  overflowY: 'auto',
})

export const phraseRow = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  padding: Spacing.sm,
  background: Colors.primaryLight,
  border: `1px solid ${Colors.primaryMid}`,
})

export const keywordTag = css({
  flexShrink: 0,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.body,
  background: Colors.primaryMid,
  padding: `${Spacing.xxs} ${Spacing.xs}`,
  whiteSpace: 'nowrap',
})

export const phraseText = css({
  flex: 1,
  fontSize: FontSize.xs,
  color: Colors.textMain,
  fontFamily: FontFamily.body,
  lineHeight: 1.5,
  margin: 0,
})

export const copyBtn = css({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: Spacing.xxs,
  padding: `${Spacing.xxs} ${Spacing.xs}`,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  background: 'transparent',
  color: Colors.primaryDark,
  border: `1px solid ${Colors.primaryDark}`,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    background: Colors.primaryDark,
    color: Colors.white,
  },
})

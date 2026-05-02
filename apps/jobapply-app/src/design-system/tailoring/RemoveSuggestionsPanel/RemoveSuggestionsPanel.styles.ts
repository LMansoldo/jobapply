import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const PANEL_MAX_HEIGHT = '28rem'

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
  color: Colors.danger,
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

export const card = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
  padding: Spacing.sm,
  background: Colors.dangerBg,
  border: `1px solid ${Colors.danger}`,
})

export const cardHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
})

export const sectionBadge = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.white,
  background: Colors.danger,
  padding: `${Spacing.xxs} ${Spacing.xs}`,
  fontFamily: FontFamily.body,
  textTransform: 'uppercase',
})

export const itemText = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  fontFamily: FontFamily.body,
  margin: 0,
})

export const reasonText = css({
  fontSize: FontSize.xs,
  color: Colors.textSub,
  fontFamily: FontFamily.body,
  margin: 0,
  lineHeight: 1.5,
})

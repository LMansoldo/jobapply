import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export const suggestionCard = css({
  margin: `0 ${Spacing.lg} ${Spacing.sm}`,
  background: 'rgba(124, 58, 237, 0.06)',
  border: '1px solid rgba(124, 58, 237, 0.18)',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.md}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  flexShrink: 0,
})

export const suggestionCardIcon = css({
  fontSize: '1.4rem',
  lineHeight: '2rem',
  flexShrink: 0,
})

export const suggestionCardText = css({
  fontSize: FontSize.sm,
  color: 'rgba(124, 58, 237, 0.9)',
  fontFamily: FontFamily.body,
  lineHeight: '1.5',
  flex: 1,
})
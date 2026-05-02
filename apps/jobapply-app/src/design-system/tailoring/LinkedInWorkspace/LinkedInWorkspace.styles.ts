import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const spinWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.lg,
  padding: Spacing.xxl,
  minHeight: '40rem',
})

export const loadingText = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
})

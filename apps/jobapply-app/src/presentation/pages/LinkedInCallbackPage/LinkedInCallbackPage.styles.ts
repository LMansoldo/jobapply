import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const root = css({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.lg,
  background: Colors.pageBg,
})

export const icon = css({
  fontSize: '4.8rem',
  color: Colors.socialLinkedin,
})

export const message = css({
  margin: 0,
  fontSize: FontSize.base,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  fontWeight: FontWeight.medium,
})

export const backBtn = css({
  padding: `${Spacing.sm} ${Spacing.xl}`,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  cursor: 'pointer',
  '&:hover': { opacity: 0.88 },
})

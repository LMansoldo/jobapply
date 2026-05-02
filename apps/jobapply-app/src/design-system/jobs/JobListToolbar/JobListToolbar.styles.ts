import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontSize, FontWeight, FontFamily, LetterSpacing } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const toolbar = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Spacing.md} ${Spacing.lg}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  flexShrink: 0,
})

export const count = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  margin: 0,
  letterSpacing: LetterSpacing.tight,
})

export const countAccent = css({
  color: Colors.primary,
})

export const sortBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: Spacing.xs,
  background: 'none',
  border: `1px solid ${Colors.borderLight}`,
  borderRadius: BorderRadius.sm,
  padding: `${Spacing.xxs} ${Spacing.sm}`,
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.medium,
  color: Colors.textSub,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    background: Colors.surfacePage,
    color: Colors.textMain,
  },
})

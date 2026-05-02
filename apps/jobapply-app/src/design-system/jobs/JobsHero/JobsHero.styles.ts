import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { Shadows } from '../../../styles/theme/shadows'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const hero = css({
  background: Colors.gradientTailorBtn,
  padding: `${Spacing.xxl} ${Spacing.lg}`,
  textAlign: 'center',
  width: '100%',
})

export const inner = css({
  maxWidth: '72rem',
  margin: '0 auto',
})

export const title = css({
  fontFamily: FontFamily.heading,
  color: Colors.white,
  fontSize: FontSize.h3,
  fontWeight: FontWeight.bold,
  margin: `0 0 ${Spacing.sm}`,
  lineHeight: 1.2,
})

export const subtitle = css({
  fontFamily: FontFamily.body,
  color: 'rgba(255,255,255,0.85)',
  fontSize: FontSize.base,
  margin: `0 0 ${Spacing.xl}`,
})

export const searchForm = css({
  display: 'flex',
  alignItems: 'center',
  background: Colors.white,
  borderRadius: BorderRadius.base,
  padding: Spacing.sm,
  boxShadow: Shadows.heroSearch,
  marginBottom: Spacing.lg,
  gap: 0,
})

export const inputSection = css({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  gap: Spacing.sm,
  padding: `0 ${Spacing.md}`,
  minWidth: 0,
})

export const inputIcon = css({
  color: Colors.textSub,
  fontSize: FontSize.lg,
  flexShrink: 0,
})

export const inputNative = css({
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: FontSize.base,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  background: 'transparent',
  minWidth: 0,
  '&::placeholder': {
    color: Colors.textSub,
  },
})

export const formDivider = css({
  width: '1px',
  height: '2.4rem',
  background: Colors.surfaceBorder,
  flexShrink: 0,
})

export const searchBtn = css({
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.xl,
  padding: `${Spacing.md} ${Spacing.xl}`,
  fontSize: FontSize.base,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.15s',
  '&:hover': {
    background: Colors.primaryDeeper,
  },
})

export const chipsRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: Spacing.sm,
})

export const chip = css({
  background: 'transparent',
  color: Colors.white,
  border: '1px solid rgba(255,255,255,0.45)',
  borderRadius: BorderRadius.full,
  padding: `${Spacing.xs} ${Spacing.md}`,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'background 0.15s',
  '&:hover': {
    background: 'rgba(255,255,255,0.15)',
  },
})

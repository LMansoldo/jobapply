import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { Shadows } from '../../../styles/theme/shadows'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontSize, FontWeight, FontFamily, LetterSpacing } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const hero = css({
  backgroundColor: Colors.primaryDark,
  backgroundImage: [
    'radial-gradient(ellipse at 20% 50%, rgba(124,90,240,0.5) 0%, transparent 60%)',
    'radial-gradient(ellipse at 80% 20%, rgba(91,61,232,0.8) 0%, transparent 50%)',
  ].join(', '),
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

export const eyebrow = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  fontFamily: FontFamily.body,
  color: 'rgba(255,255,255,0.6)',
  letterSpacing: LetterSpacing.eyebrow,
  textTransform: 'uppercase',
  marginBottom: Spacing.sm,
})

export const searchForm = css({
  display: 'flex',
  alignItems: 'center',
  background: Colors.white,
  borderRadius: BorderRadius.full,
  overflow: 'hidden',
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
  display: 'flex',
  alignItems: 'center',
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
  borderRadius: BorderRadius.full,
  padding: `${Spacing.md} ${Spacing.xl}`,
  margin: Spacing.xs,
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
  transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
  '&:hover': {
    background: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.4)',
    transform: 'translateY(-0.1rem)',
  },
})

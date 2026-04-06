import type { CSSProperties } from 'react'
import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const base: CSSProperties = {
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  borderRadius: BorderRadius.full,
  padding: `0 ${Spacing.lg}`,
  height: '4.0rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.xs,
  transition: 'all 0.2s ease',
  border: 'none',
  fontSize: '1.4rem',
}

export const variantStyles: Record<string, CSSProperties> = {
  primary: {
    ...base,
    background: Colors.gradientTailorBtn,
    color: Colors.white,
    boxShadow: Shadows.cta,
  },
  ghost: {
    ...base,
    background: 'transparent',
    color: Colors.primaryDark,
    border: `1.5px solid ${Colors.primaryDark}`,
  },
  'ghost-dark': {
    ...base,
    background: 'transparent',
    color: Colors.white,
    border: `1.5px solid ${Colors.white}`,
  },
  'solid-white': {
    ...base,
    background: Colors.white,
    color: Colors.primaryDark,
    boxShadow: Shadows.sm,
  },
}

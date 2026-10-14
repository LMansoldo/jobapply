/**
 * @file emotionTheme.ts
 * @description Single Emotion theme. Reuses the hand-rolled token modules —
 * never redeclare values here, import from the token files.
 */
import type { UITheme } from '@jobapply/ui'
import { Colors } from './colors'
import { Spacing } from './spacing'
import { FontFamily, FontSize, FontWeight, LineHeight, LetterSpacing } from './typography'
import { BorderRadius } from './radius'
import { Shadows } from './shadows'
import { breakpoints, mediaQueries } from './breakpoints'

export type EmotionTheme = UITheme

export const theme: UITheme = {
  colors: Colors,
  spacing: Spacing,
  typography: {
    family: FontFamily,
    size: FontSize,
    weight: FontWeight,
    lineHeight: LineHeight,
    letterSpacing: LetterSpacing,
  },
  radius: BorderRadius,
  shadows: Shadows,
  breakpoints,
  mediaQueries,
}

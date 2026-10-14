import type { UITheme } from '@jobapply/ui'
import { Colors } from './theme/colors'
import { Spacing } from './theme/spacing'
import { FontFamily, FontSize, FontWeight, LineHeight, LetterSpacing } from './theme/typography'
import { BorderRadius } from './theme/radius'
import { Shadows } from './theme/shadows'
import { breakpoints, mediaQueries } from './theme/breakpoints'

export type ExtensionTheme = UITheme

export const theme: ExtensionTheme = {
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

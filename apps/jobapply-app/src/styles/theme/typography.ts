/**
 * @file typography.ts
 * @description Font size scale. 1rem = 10px (html font-size: 62.5%).
 */

/** Font size scale in rem units */
export const FontSize = {
  xxs: '1.0rem',
  xs: '1.1rem',
  sm: '1.2rem',
  md0: '1.3rem',
  md: '1.4rem',
  md2: '1.5rem',
  base: '1.6rem',
  lg: '1.8rem',
  xl: '2.0rem',
  xxl: '2.2rem',
  h3: '3.2rem',
} as const

export type FontSizeKey = keyof typeof FontSize

/** Font family tokens */
export const FontFamily = {
  heading: "'Sora', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'Courier New', Courier, monospace",
} as const

export type FontFamilyKey = keyof typeof FontFamily

/** Font weight tokens */
export const FontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

export type FontWeightKey = keyof typeof FontWeight

/** Line height tokens */
export const LineHeight = {
  tight: 1.05,
  snug: 1.15,
  normal: 1.4,
  relaxed: 1.55,
  loose: 1.65,
  spacious: 1.7,
  editor: 1.65,
} as const

export type LineHeightKey = keyof typeof LineHeight

/** Letter spacing tokens */
export const LetterSpacing = {
  tighter: '-2px',
  tight: '-1px',
  normal: '0',
  wide: '0.4px',
  wider: '0.5px',
  widest: '1.5px',
  badge: '0.6px',
  label: '0.8px',
  eyebrow: '1px',
} as const

export type LetterSpacingKey = keyof typeof LetterSpacing

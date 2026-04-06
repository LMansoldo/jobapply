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

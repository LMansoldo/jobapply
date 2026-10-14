/**
 * @file spacing.ts
 * @description Spacing scale. 1rem = 10px (html font-size: 62.5%).
 */

/** Spacing scale in rem units */
export const Spacing = {
  px: '0.1rem',
  xxs: '0.2rem',
  xs: '0.4rem',
  sm2: '0.6rem',
  sm: '0.8rem',
  md0: '1.0rem',
  md1: '1.2rem',
  md2: '1.4rem',
  md: '1.6rem',
  lg0: '1.8rem',
  lg1: '2.0rem',
  lg: '2.4rem',
  xl0: '2.8rem',
  xl: '3.2rem',
  xxl: '4.8rem',
  headerHeight: '5.6rem',
  mobileNavHeight: '6.0rem',
  mobileNavPad: '7.2rem',
  xxxl: '8.0rem',
  sidebarWidth: '40.0rem',
  editorHeightMobile: '42.0rem',
  pageMaxWidth: '128.0rem',
} as const

export type SpacingKey = keyof typeof Spacing

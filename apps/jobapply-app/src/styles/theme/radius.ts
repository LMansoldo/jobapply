/**
 * @file radius.ts
 * @description Border radius tokens.
 */

export const BorderRadius = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '10px',
  base: '14px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
  avatar: '50%',
  logo: '12px',
  chip: '10px',
} as const

export type BorderRadiusKey = keyof typeof BorderRadius

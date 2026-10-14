/**
 * @file shadows.ts
 * @description Box shadow tokens.
 */

export const Shadows = {
  sm: '0 2px 16px rgba(124, 58, 237, 0.08)',
  md: '0 4px 32px rgba(124, 58, 237, 0.14)',
  lg: '0 20px 60px rgba(124, 58, 237, 0.22)',
  auth: '0 24px 64px rgba(124, 58, 237, 0.22)',
  cta: '0 2px 12px rgba(124, 58, 237, 0.30)',
  ctaHover: '0 4px 20px rgba(124, 58, 237, 0.45)',
  heroSearch: '0 8px 40px rgba(0, 0, 0, 0.22)',
  avatar: '0 2px 12px rgba(0, 0, 0, 0.15)',
  focus: '0 0 0 3px rgba(167, 139, 250, 0.20)',
  focusDark: '0 0 0 4px rgba(124, 58, 237, 0.18)',
} as const

export type ShadowKey = keyof typeof Shadows

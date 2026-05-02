/**
 * @file breakpoints.ts
 * @description Responsive design breakpoints and media query helpers.
 * Mobile-first approach: xs → sm → md → lg → xl → xxl
 */

/** Breakpoint values in pixels */
export const breakpoints = {
  xs: '0px',      // Extra small (mobile)
  sm: '576px',    // Small (mobile landscape / small tablet)
  md: '768px',    // Medium (tablet)
  lg: '992px',    // Large (desktop small)
  xl: '1200px',   // Extra large (desktop)
  xxl: '1600px',  // Extra extra large (wide desktop)
} as const

/** Media query strings for use in CSS-in-JS */
export const mediaQueries = {
  /** Mobile and up (>= 0px) */
  xs: `@media (min-width: ${breakpoints.xs})`,
  /** Small and up (>= 576px) */
  sm: `@media (min-width: ${breakpoints.sm})`,
  /** Medium and up (>= 768px) */
  md: `@media (min-width: ${breakpoints.md})`,
  /** Large and up (>= 992px) */
  lg: `@media (min-width: ${breakpoints.lg})`,
  /** Extra large and up (>= 1200px) */
  xl: `@media (min-width: ${breakpoints.xl})`,
  /** Extra extra large and up (>= 1600px) */
  xxl: `@media (min-width: ${breakpoints.xxl})`,

  // Common ranges
  /** Only mobile (< 576px) */
  mobileOnly: `@media (max-width: 575px)`,
  /** Tablet and down (<= 991px) */
  tabletDown: `@media (max-width: 991px)`,
  /** Desktop and up (>= 992px) */
  desktopUp: `@media (min-width: ${breakpoints.lg})`,
} as const

/** Viewport size categories */
export const VIEWPORT_SIZES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const

export type ViewportSize = typeof VIEWPORT_SIZES[keyof typeof VIEWPORT_SIZES]
export type BreakpointKey = keyof typeof breakpoints
export type MediaQueryKey = keyof typeof mediaQueries

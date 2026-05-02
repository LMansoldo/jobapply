/**
 * ─────────────────────────────────────────────────────────────────
 *  JobBoard Design System — theme.ts
 *  Use with: Storybook, Ant Design ConfigProvider, styled-components,
 *            CSS-in-JS, or vanilla CSS custom properties generation.
 *
 *  All raw values here are the single source of truth.
 *  The CSS custom properties in every .html mockup are derived from this file.
 * ─────────────────────────────────────────────────────────────────
 */

// ─── COLOR PALETTE ────────────────────────────────────────────────

export const colors = {
  // Primary — pastel purple brand ramp
  primary: {
    50:  '#f5f3ff',  // page background
    100: '#ede9fe',  // light tint  (--primary-light)
    200: '#ddd6fe',
    300: '#c4b5fd',  // mid tint    (--primary-mid)
    400: '#a78bfa',  // brand base  (--primary)
    500: '#8b5cf6',
    600: '#7c3aed',  // dark shade  (--primary-dark)
    700: '#6d28d9',
    800: '#5b21b6',  // deeper      (--primary-deeper)
    900: '#4c1d95',
    950: '#2d1065',
  },

  // Accent — pink / fuchsia
  accent: {
    DEFAULT: '#f0abfc',  // --accent
    pink:    '#fb7185',  // --accent2 (CTA gradient end)
  },

  // Semantic surfaces
  surface: {
    page:    '#f5f3ff',  // --bg
    card:    '#ffffff',  // --surface
    border:  '#e9e4fc',  // --border
    dark:    '#1a0533',  // hero/auth left panel deepest
    darker:  '#13102a',  // Monaco toolbar
    editor:  '#1a1730',  // Monaco editor bg
    editorBorder: '#2d2850',
  },

  // Text
  text: {
    primary:  '#1e1b2e',  // --text-main
    secondary: '#6b7280', // --text-sub
    disabled:  '#a0aec0', // --text-light
    inverse:   '#ffffff',
    link:      '#7c3aed', // same as primary.600
    editorBase: '#e2d9f3',
    editorMuted: '#9ca3af',
    lineNumbers: '#3d3868',
  },

  // Semantic status
  success: {
    DEFAULT: '#34d399',  // --green
    bg:      '#d1fae5',
    dark:    '#065f46',
  },
  warning: {
    DEFAULT: '#fbbf24',  // --yellow
    bg:      '#fef3c7',
    dark:    '#92400e',
  },
  error: {
    DEFAULT: '#f87171',  // --red
    bg:      '#fef2f2',
    dark:    '#b91c1c',
  },
  info: {
    DEFAULT: '#60a5fa',  // --blue
    bg:      '#dbeafe',
    dark:    '#1d4ed8',
  },
  orange: {
    DEFAULT: '#fb923c',  // --orange
    bg:      '#ffedd5',
    dark:    '#c2410c',
  },

  // Editor syntax highlight (Monaco-like)
  syntax: {
    heading:  '#c4b5fd',
    keyword:  '#a78bfa',
    string:   '#f0abfc',
    comment:  '#6b7280',
    insert:   '#86efac',
    delete:   '#fca5a5',
    mark:     '#fcd34d',
  },

  // Social brand
  social: {
    google:   '#EA4335',
    linkedin: '#0077B5',
    github:   '#24292F',
  },
} as const;


// ─── TYPOGRAPHY ───────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    /** Display / headings — Sora from Google Fonts */
    heading: "'Sora', sans-serif",
    /** Body / UI — DM Sans from Google Fonts */
    body:    "'DM Sans', sans-serif",
    /** Code / Monaco editor */
    mono:    "'Courier New', Courier, monospace",
  },

  fontWeight: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    extrabold: 800,
  },

  fontSize: {
    /** Micro labels, badges */
    '2xs': '10px',
    /** Meta, timestamps, captions */
    xs:    '11px',
    /** Secondary labels, sub-text */
    sm:    '12px',
    /** Filter tags, tooltips */
    'sm+': '12.5px',
    /** Default body */
    base:  '14px',
    /** Slightly larger body */
    'base+': '14.5px',
    /** Section headings / card titles */
    md:    '15px',
    /** Card primary titles */
    lg:    '15.5px',
    /** Auth form titles */
    xl:    '16px',
    /** Sidebar section */
    '2xl': '17px',
    /** Auth page heading */
    '3xl': '20px',
    /** Wizard title */
    '4xl': '22px',
    /** Section title */
    '5xl': '24px',
    /** Hero sub section */
    '6xl': '26px',
    /** Logo */
    '7xl': '28px',
    /** Section titles (responsive) */
    '8xl': '44px',
    /** Landing hero (responsive) */
    hero: 'clamp(42px, 7vw, 80px)',
  },

  lineHeight: {
    tight:   1.05,
    snug:    1.15,
    normal:  1.4,
    relaxed: 1.55,
    loose:   1.65,
    spacious: 1.7,
    editor:  1.65,
  },

  letterSpacing: {
    tighter: '-2px',
    tight:   '-1px',
    normal:  '0',
    wide:    '0.4px',
    wider:   '0.5px',
    widest:  '1.5px',
    badge:   '0.6px',
    label:   '0.8px',
    eyebrow: '1px',
  },
} as const;


// ─── SPACING ──────────────────────────────────────────────────────
// Base-4 scale in px. Use multiples of 4 consistently.

export const spacing = {
  0:   '0px',
  1:   '2px',
  2:   '4px',
  3:   '6px',
  4:   '8px',
  5:   '10px',
  6:   '12px',
  7:   '14px',
  8:   '16px',
  9:   '18px',
  10:  '20px',
  11:  '22px',
  12:  '24px',
  14:  '28px',
  16:  '32px',
  18:  '36px',
  20:  '40px',
  24:  '48px',
  28:  '56px',
  32:  '64px',
  36:  '72px',
  40:  '80px',
  48:  '96px',
  56:  '112px',
  64:  '128px',
} as const;


// ─── BORDER RADIUS ────────────────────────────────────────────────

export const radius = {
  none:  '0px',
  xs:    '4px',   // checkbox, small elements
  sm:    '8px',   // --radius-sm: inputs, filter tags
  md:    '10px',  // auth inputs
  base:  '14px',  // --radius: cards, panels
  lg:    '16px',  // auth cards, landing cards
  xl:    '20px',  // modals
  full:  '9999px', // pills, badges, buttons
  avatar: '50%',   // circular avatars
  logo:  '12px',   // company logos
  chip:  '10px',   // alert icons
} as const;


// ─── SHADOWS ──────────────────────────────────────────────────────

export const shadows = {
  /** Subtle card elevation (default) */
  sm:   '0 2px 16px rgba(124, 58, 237, 0.08)',
  /** Hover / focused card */
  md:   '0 4px 32px rgba(124, 58, 237, 0.14)',
  /** Modals, deep panels */
  lg:   '0 20px 60px rgba(124, 58, 237, 0.22)',
  /** Auth left panel visual */
  auth: '0 24px 64px rgba(124, 58, 237, 0.22)',
  /** Tailor button CTA */
  cta:  '0 2px 12px rgba(124, 58, 237, 0.30)',
  ctaHover: '0 4px 20px rgba(124, 58, 237, 0.45)',
  /** Hero search bar */
  heroSearch: '0 8px 40px rgba(0, 0, 0, 0.22)',
  /** Password strength — avatar */
  avatar: '0 2px 12px rgba(0, 0, 0, 0.15)',
  /** Focus ring on interactive elements */
  focus: '0 0 0 3px rgba(167, 139, 250, 0.20)',
  focusDark: '0 0 0 4px rgba(124, 58, 237, 0.18)',
} as const;


// ─── GRADIENTS ────────────────────────────────────────────────────

export const gradients = {
  /** Main hero / auth left panel */
  heroDark:     'linear-gradient(145deg, #1a0533 0%, #2d1065 40%, #4c1d95 70%, #6d28d9 100%)',
  /** Secondary hero (job-search page) */
  heroMedium:   'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)',
  /** CV header bar */
  cvHeader:     'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #f0abfc 100%)',
  /** CTA band */
  ctaBand:      'linear-gradient(135deg, #7c3aed 0%, #4c1d95 50%, #7c3aed 100%)',
  /** Profile banner */
  profileBanner: 'linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)',
  /** Primary button / brand gradient text */
  brandText:    'linear-gradient(90deg, #c4b5fd, #f0abfc, #fb7185)',
  /** Skill bar / progress fills */
  progressBar:  'linear-gradient(90deg, #a78bfa, #f0abfc)',
  /** Tailor CTA button */
  tailorBtn:    'linear-gradient(135deg, #7c3aed, #6d28d9)',
  /** AI toolbar strip */
  aiToolbar:    'linear-gradient(90deg, rgba(124,58,237,.15) 0%, rgba(240,171,252,.08) 100%)',
  /** Auth left orb 1 */
  orb1:         'radial-gradient(circle, #f0abfc 0%, transparent 70%)',
  /** Auth left orb 2 */
  orb2:         'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
  /** Grid texture overlay */
  gridTexture:  'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
} as const;


// ─── ANIMATION ────────────────────────────────────────────────────

export const animation = {
  duration: {
    instant: '0ms',
    fast:    '100ms',
    base:    '150ms',
    smooth:  '200ms',
    medium:  '250ms',
    slow:    '300ms',
    slower:  '350ms',
    page:    '600ms',
  },
  easing: {
    default: 'ease',
    in:      'ease-in',
    out:     'ease-out',
    inOut:   'ease-in-out',
    spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
    modal:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  keyframes: {
    /** Card / section entrance */
    fadeUp:   'from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); }',
    fadeIn:   'from { opacity:0; } to { opacity:1; }',
    /** Modal entrance */
    popIn:    'from { opacity:0; transform:scale(.9) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); }',
    /** Hero orbs */
    floatOrb: '0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(30px,-40px) scale(1.05); } 66% { transform:translate(-20px,20px) scale(.95); }',
    /** Live pulse (dot, AI indicator) */
    pulse:    '0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.4); }',
    /** Scroll arrow bounce */
    bounce:   '0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(8px); }',
  },
  stagger: {
    /** Job card list stagger delays */
    card: ['0.05s','0.10s','0.15s','0.20s','0.25s','0.30s'],
    /** Landing section stagger */
    section: ['0s','0.1s','0.2s','0.3s','0.4s'],
  },
} as const;


// ─── BREAKPOINTS ──────────────────────────────────────────────────

export const breakpoints = {
  xs:  '480px',
  sm:  '640px',
  md:  '768px',
  lg:  '900px',
  xl:  '1100px',
  '2xl': '1280px',
  '3xl': '1320px',
  '4xl': '1400px',
} as const;


// ─── Z-INDEX ──────────────────────────────────────────────────────

export const zIndex = {
  below:   -1,
  base:     0,
  raised:   1,
  dropdown: 10,
  sticky:   100,
  fixed:    100,
  overlay:  200,
  modal:    300,
  toast:    400,
  tooltip:  500,
} as const;


// ─── COMPONENT SIZING ─────────────────────────────────────────────

export const sizing = {
  header: {
    height: '60px',
    heightLanding: '68px',
    maxWidth: '1320px',
    maxWidthWide: '1400px',
  },
  sidebar: {
    leftWidth: '260px',
    leftWidthSm: '240px',
    rightWidth: '300px',
    rightWidthTailoring: '320px',
    atsPanel: '300px',
  },
  avatar: {
    xs:  '28px',
    sm:  '32px',
    md:  '42px',
    lg:  '60px',
    xl:  '64px',
  },
  companyLogo: {
    sm:  '30px',
    md:  '38px',
    lg:  '52px',
  },
  button: {
    heightSm:   '36px',
    heightMd:   '44px',
    heightLg:   '46px',
    heightXl:   '50px',
    iconSquare:  '34px',
  },
  input: {
    height: '40px',
    heightLg: '46px',
  },
  card: {
    paddingDefault: '20px',
    paddingWizard:  '28px',
    paddingAuth:    '32px',
  },
  modal: {
    width: '480px',
  },
  progressBar: {
    heightSm: '3px',
    heightMd: '5px',
    heightLg: '6px',
    heightXl: '8px',
  },
  score: {
    ringSize:   '120px',
    ringSmSize: '90px',
    strokeWidth: 10,
  },
} as const;


// ─── LAYOUT / GRID ────────────────────────────────────────────────

export const layout = {
  page: {
    maxWidth: '1320px',
    maxWidthWide: '1400px',
    maxWidthNarrow: '900px',
    maxWidthEditor: '1100px',
    paddingX: '24px',
    paddingXMobile: '16px',
    paddingXAuth: '56px',
    gap: '24px',
  },
  grid: {
    /** Main 3-col layout: filters | jobs | sidebar */
    main:     '260px 1fr 300px',
    mainMd:   '240px 1fr',
    mainSm:   '1fr',
    /** Tailoring workspace: ATS | editor | preview */
    tailoring: '300px 1fr 320px',
    /** Editor split: code | preview */
    editor:   '1fr 1fr',
    /** Auth split: left panel | form */
    auth:     '1fr 1fr',
    /** Features 3 col */
    features: 'repeat(3, 1fr)',
    /** Testimonials 3 col */
    testimonials: 'repeat(3, 1fr)',
    /** How it works 2 col */
    howItWorks: '1fr 1fr',
    /** Form 2 col */
    form: '1fr 1fr',
  },
} as const;


// ─── ANT DESIGN TOKEN MAPPING ─────────────────────────────────────
/**
 * Pass this object to <ConfigProvider theme={{ token: antdTokens }}>
 * Ant Design v5 uses CSS-in-JS design tokens.
 * https://ant.design/docs/react/customize-theme
 */

export const antdTokens = {
  // Brand
  colorPrimary:          colors.primary[400],  // #a78bfa
  colorPrimaryHover:     colors.primary[600],  // #7c3aed
  colorPrimaryActive:    colors.primary[800],  // #5b21b6
  colorPrimaryBg:        colors.primary[100],  // #ede9fe
  colorPrimaryBgHover:   colors.primary[300],  // #c4b5fd
  colorPrimaryBorder:    colors.primary[300],
  colorPrimaryText:      colors.primary[600],

  // Text
  colorText:             colors.text.primary,
  colorTextSecondary:    colors.text.secondary,
  colorTextDisabled:     colors.text.disabled,
  colorTextPlaceholder:  colors.text.disabled,
  colorTextHeading:      colors.text.primary,
  colorTextLabel:        colors.text.secondary,
  colorTextDescription:  colors.text.secondary,
  colorLink:             colors.primary[600],
  colorLinkHover:        colors.primary[800],

  // Background
  colorBgBase:           colors.surface.page,
  colorBgContainer:      colors.surface.card,
  colorBgElevated:       colors.surface.card,
  colorBgLayout:         colors.surface.page,
  colorBgSpotlight:      colors.primary[100],
  colorBgMask:           'rgba(30, 27, 46, 0.55)',

  // Border
  colorBorder:           colors.surface.border,
  colorBorderSecondary:  colors.surface.border,
  colorSplit:            colors.surface.border,

  // Semantic
  colorSuccess:          colors.success.DEFAULT,
  colorSuccessBg:        colors.success.bg,
  colorSuccessText:      colors.success.dark,
  colorWarning:          colors.warning.DEFAULT,
  colorWarningBg:        colors.warning.bg,
  colorWarningText:      colors.warning.dark,
  colorError:            colors.error.DEFAULT,
  colorErrorBg:          colors.error.bg,
  colorErrorText:        colors.error.dark,
  colorInfo:             colors.info.DEFAULT,
  colorInfoBg:           colors.info.bg,
  colorInfoText:         colors.info.dark,

  // Shape
  borderRadius:          8,   // --radius-sm: inputs, buttons
  borderRadiusLG:        14,  // --radius: cards
  borderRadiusSM:        4,   // checkboxes, small chips
  borderRadiusXS:        2,
  borderRadiusOuter:     16,  // modals, landing cards

  // Typography
  fontFamily:            typography.fontFamily.body,
  fontFamilyCode:        typography.fontFamily.mono,
  fontSize:              14,
  fontSizeSM:            12,
  fontSizeLG:            16,
  fontSizeXL:            20,
  fontSizeHeading1:      44,
  fontSizeHeading2:      32,
  fontSizeHeading3:      22,
  fontSizeHeading4:      18,
  fontSizeHeading5:      16,
  fontWeightStrong:      700,
  lineHeight:            1.55,
  lineHeightLG:          1.65,
  lineHeightSM:          1.4,

  // Spacing
  padding:              20,
  paddingXS:             8,
  paddingSM:            12,
  paddingLG:            24,
  paddingXL:            32,
  paddingContentHorizontal: 24,
  margin:               20,
  marginXS:              8,
  marginSM:             12,
  marginLG:             24,
  marginXL:             32,

  // Component sizing
  controlHeight:        40,
  controlHeightSM:      32,
  controlHeightLG:      46,
  controlHeightXS:      24,
  controlOutlineWidth:   3,
  controlOutline:       'rgba(167, 139, 250, 0.20)',

  // Motion
  motionDurationFast:   '0.1s',
  motionDurationMid:    '0.2s',
  motionDurationSlow:   '0.3s',
  motionEaseInOut:      'ease-in-out',
  motionEaseOut:        'ease-out',
  motionEaseIn:         'ease-in',

  // Shadow
  boxShadow:            '0 2px 16px rgba(124, 58, 237, 0.08)',
  boxShadowSecondary:   '0 4px 32px rgba(124, 58, 237, 0.14)',
  boxShadowTertiary:    '0 20px 60px rgba(124, 58, 237, 0.22)',

  // Scrollbar
  colorScrollbar:       colors.primary[300],
  colorScrollbarThumb:  colors.primary[400],
} as const;


// ─── ANT DESIGN COMPONENT OVERRIDES ──────────────────────────────
/**
 * Pass as: <ConfigProvider theme={{ components: antdComponents }}>
 * These override specific Ant Design components to match JobBoard style.
 */

export const antdComponents = {
  Button: {
    borderRadius:       9999,
    controlHeight:      40,
    controlHeightLG:    50,
    controlHeightSM:    34,
    fontWeight:         600,
    primaryShadow:      '0 4px 16px rgba(124,58,237,.30)',
  },
  Input: {
    borderRadius:       8,
    controlHeight:      40,
    controlHeightLG:    46,
    colorBgContainer:   colors.surface.page,
    activeShadow:       '0 0 0 3px rgba(167, 139, 250, 0.20)',
  },
  Select: {
    borderRadius:       8,
    controlHeight:      40,
    colorBgContainer:   colors.surface.card,
  },
  Card: {
    borderRadius:       14,
    boxShadow:          '0 2px 16px rgba(124, 58, 237, 0.08)',
    colorBorderSecondary: colors.surface.border,
  },
  Modal: {
    borderRadius:       20,
    boxShadow:          '0 24px 64px rgba(124, 58, 237, 0.22)',
  },
  Tag: {
    borderRadius:       9999,
    defaultBg:          colors.primary[100],
    defaultColor:       colors.primary[600],
  },
  Badge: {
    borderRadius:       9999,
    colorPrimary:       colors.primary[400],
  },
  Slider: {
    handleColor:        colors.primary[600],
    trackBg:            colors.primary[400],
    railBg:             colors.surface.border,
  },
  Progress: {
    defaultColor:       colors.primary[400],
    remainingColor:     colors.primary[100],
  },
  Tabs: {
    inkBarColor:        colors.primary[400],
    itemActiveColor:    colors.primary[600],
    itemHoverColor:     colors.primary[600],
    itemSelectedColor:  colors.primary[600],
    fontWeight:         600,
  },
  Checkbox: {
    borderRadius:       4,
    colorPrimary:       colors.primary[400],
    controlInteractiveSize: 17,
  },
  Steps: {
    colorPrimary:       colors.primary[600],
    colorPrimaryHover:  colors.primary[800],
    finishIconBorderColor: colors.primary[400],
    processIconBg:      colors.primary[600],
    finishIconBg:       colors.primary[400],
  },
  Avatar: {
    colorBgBase:        colors.primary[600],
    colorTextBase:      '#ffffff',
    borderRadius:       9999,
  },
  Pagination: {
    borderRadius:       8,
    itemActiveBg:       colors.primary[400],
    colorPrimary:       colors.primary[400],
    colorPrimaryHover:  colors.primary[600],
  },
  Menu: {
    itemBorderRadius:   8,
    itemSelectedBg:     colors.primary[100],
    itemSelectedColor:  colors.primary[600],
    itemHoverBg:        colors.primary[100],
    itemHoverColor:     colors.primary[600],
  },
  Tooltip: {
    borderRadius:       8,
    colorBgSpotlight:   colors.text.primary,
  },
  Notification: {
    borderRadius:       14,
    boxShadow:          '0 4px 32px rgba(124, 58, 237, 0.14)',
  },
} as const;


// ─── CSS CUSTOM PROPERTIES GENERATOR ─────────────────────────────
/**
 * Call generateCSSVars() to get a string you can inject into :root {}
 * Useful for vanilla CSS or SSR style injection.
 */

export function generateCSSVars(): string {
  return `
  :root {
    /* Primary palette */
    --color-primary:        ${colors.primary[400]};
    --color-primary-dark:   ${colors.primary[600]};
    --color-primary-deeper: ${colors.primary[800]};
    --color-primary-light:  ${colors.primary[100]};
    --color-primary-mid:    ${colors.primary[300]};
    --color-accent:         ${colors.accent.DEFAULT};
    --color-accent2:        ${colors.accent.pink};

    /* Surface */
    --color-bg:             ${colors.surface.page};
    --color-surface:        ${colors.surface.card};
    --color-border:         ${colors.surface.border};

    /* Text */
    --color-text:           ${colors.text.primary};
    --color-text-sub:       ${colors.text.secondary};
    --color-text-light:     ${colors.text.disabled};

    /* Semantic */
    --color-success:        ${colors.success.DEFAULT};
    --color-warning:        ${colors.warning.DEFAULT};
    --color-error:          ${colors.error.DEFAULT};
    --color-info:           ${colors.info.DEFAULT};
    --color-orange:         ${colors.orange.DEFAULT};

    /* Typography */
    --font-heading:         ${typography.fontFamily.heading};
    --font-body:            ${typography.fontFamily.body};
    --font-mono:            ${typography.fontFamily.mono};

    /* Radius */
    --radius:               ${radius.base};
    --radius-sm:            ${radius.sm};
    --radius-lg:            ${radius.lg};
    --radius-full:          ${radius.full};

    /* Shadows */
    --shadow:               ${shadows.sm};
    --shadow-md:            ${shadows.md};
    --shadow-lg:            ${shadows.lg};
  }
  `.trim();
}


// ─── STORYBOOK THEME OBJECT ───────────────────────────────────────
/**
 * Import in .storybook/manager.ts:
 *   import { addons } from '@storybook/addons';
 *   import { storybookTheme } from '../src/theme';
 *   addons.setConfig({ theme: storybookTheme });
 *
 * Or in preview.ts:
 *   import { storybookTheme } from '../src/theme';
 *   export const parameters = { docs: { theme: storybookTheme } };
 */

export const storybookTheme = {
  base: 'light' as const,

  // Brand
  brandTitle:  'JobBoard Design System',
  brandUrl:    'https://jobboard.app',
  brandImage:  undefined,
  brandTarget: '_self',

  // Colors
  colorPrimary:    colors.primary[400],
  colorSecondary:  colors.primary[600],

  // App chrome
  appBg:           colors.surface.page,
  appContentBg:    colors.surface.card,
  appBorderColor:  colors.surface.border,
  appBorderRadius: 14,

  // Fonts
  fontBase:        typography.fontFamily.body,
  fontCode:        typography.fontFamily.mono,

  // Text
  textColor:       colors.text.primary,
  textInverseColor: colors.text.inverse,
  textMutedColor:  colors.text.secondary,

  // Toolbar
  barTextColor:    colors.text.secondary,
  barSelectedColor: colors.primary[600],
  barBg:           colors.surface.card,

  // Forms
  inputBg:         colors.surface.page,
  inputBorder:     colors.surface.border,
  inputTextColor:  colors.text.primary,
  inputBorderRadius: 8,

  // Buttons
  buttonBg:        colors.primary[100],
  buttonBorder:    colors.primary[300],
} as const;


// ─── COMPONENT INVENTORY (for Storybook story generation) ─────────
/**
 * List of all jobboard- prefixed components found across mockups.
 * Use this to bootstrap story files.
 */

export const componentInventory = {
  // ── GLOBAL ──────────────────────────────────────────────────────
  'jobboard-header':              'Sticky top navigation bar with logo, search and nav links',
  'jobboard-logo':                'Brand logotype with accent dot',
  'jobboard-header-search':       'Pill-shaped search input inside header',
  'jobboard-nav-link':            'Icon + label navigation item (active state supported)',
  'jobboard-btn-primary':         'Filled pill button — primary brand color',
  'jobboard-btn-ghost':           'Outlined pill button — transparent bg',
  'jobboard-btn-ghost-dark':      'Outlined pill button on dark backgrounds (landing)',
  'jobboard-btn-solid-white':     'White pill button on dark/hero backgrounds',

  // ── LAYOUT ──────────────────────────────────────────────────────
  'jobboard-page-layout':         '3-column responsive grid (sidebar | main | right panel)',
  'jobboard-card':                'Base surface card with border, shadow and padding',
  'jobboard-card-title':          'Uppercase section header inside a card',

  // ── JOB SEARCH ──────────────────────────────────────────────────
  'jobboard-hero-search':         'Full-width hero with gradient, dual search inputs and quick tags',
  'jobboard-hero-search-bar':     'Pill-shaped dual input (keyword + location) with search button',
  'jobboard-hero-tag':            'Ghost pill quick-search tag on dark backgrounds',
  'jobboard-job-card':            'Full job listing card with logo, meta, tags, salary and actions',
  'jobboard-job-card-featured':   'Job card variant with left gradient accent bar',
  'jobboard-company-logo':        'Square rounded company initials avatar',
  'jobboard-job-badge':           'Small status pill (Hot / Novo / Remoto)',
  'jobboard-skill-tag':           'Colored pill for technology/skill labels',
  'jobboard-salary-label':        'Bold salary range display',
  'jobboard-bookmark-btn':        'Circular icon toggle button for saving jobs',
  'jobboard-apply-btn':           'Inline apply CTA inside job card',
  'jobboard-tailor-btn':          'Gradient "Tailoring IA" CTA button',
  'jobboard-jobs-header':         'Result count + sort select row above job list',
  'jobboard-pagination':          'Page number control with prev/next arrows',
  'jobboard-sort-select':         'Dropdown selector for result ordering',

  // ── FILTERS ─────────────────────────────────────────────────────
  'jobboard-filter-panel':        'Left sidebar filter card container',
  'jobboard-filter-section':      'Labelled group of filter controls',
  'jobboard-filter-label':        'Uppercase section label inside filter',
  'jobboard-filter-checkbox':     'Custom styled checkbox with count badge',
  'jobboard-filter-tag':          'Toggleable pill tag for filter selection',
  'jobboard-filter-tag-cloud':    'Flex wrap group of filter tags',
  'jobboard-salary-range':        'Styled range input with live label',
  'jobboard-filter-actions':      'Apply / Reset button pair',

  // ── RIGHT SIDEBAR ────────────────────────────────────────────────
  'jobboard-profile-card':        'User mini-profile with banner, avatar, stats and progress',
  'jobboard-profile-banner':      'Gradient top strip in profile card',
  'jobboard-profile-avatar':      'Circular initials avatar overlapping banner',
  'jobboard-profile-stats':       '3-column stat row (candidaturas / entrevistas / ofertas)',
  'jobboard-progress-bar':        'Gradient horizontal fill progress indicator',
  'jobboard-alert-row':           'Single job alert item with icon, label and count badge',
  'jobboard-news-item':           'Industry news row with emoji thumb and text',
  'jobboard-company-row':         'Featured company row with logo and open jobs count',

  // ── CV BUILDER ──────────────────────────────────────────────────
  'jobboard-wizard-stepper':      '3-step horizontal progress stepper',
  'jobboard-wizard-card':         'Full wizard step container with header, body and footer',
  'jobboard-wizard-footer':       'Step navigation footer with Back / Next buttons',
  'jobboard-form-group':          'Label + input field unit',
  'jobboard-form-input':          'Styled text input with focus ring',
  'jobboard-form-input-icon':     'Input with left icon decoration',
  'jobboard-avatar-upload':       'Dashed drop zone for profile photo upload',
  'jobboard-role-card':           'Selectable card for user role (Candidato/Empresa/Ambos)',
  'jobboard-tip-box':             'Left-bordered info/tip callout box',
  'jobboard-cv-paper':            'Rendered CV document with header, body and sidebar',
  'jobboard-cv-section':          'Named section inside CV document',
  'jobboard-cv-header-bar':       'Gradient top band of CV with contact info',

  // ── EDITOR ──────────────────────────────────────────────────────
  'jobboard-editor-toolbar':      'Word-like dual-row formatting toolbar',
  'jobboard-toolbar-btn':         'Single formatting action button',
  'jobboard-toolbar-select':      'Font/size dropdown inside toolbar',
  'jobboard-section-bar':         'Horizontal chip navigation for CV sections',
  'jobboard-section-chip':        'Clickable section shortcut chip',
  'jobboard-monaco-editor':       'Dark-themed code editor area with line numbers',
  'jobboard-editor-status-bar':   'Bottom status strip (language / position / word count)',
  'jobboard-preview-panel':       'Live markdown preview alongside editor',
  'jobboard-preview-tabs':        'Preview / HTML tab switcher',
  'jobboard-score-panel':         'Right panel showing CV score with ring and actions',
  'jobboard-lang-tabs':           'PT-BR / English version toggle tabs',

  // ── TAILORING ───────────────────────────────────────────────────
  'jobboard-ctx-bar':             'Context breadcrumb bar (job title + language badge)',
  'jobboard-workspace-tabs':      'ATS / Cover Letter / Video tab switcher',
  'jobboard-ats-panel':           'Left ATS score panel with ring, categories and keywords',
  'jobboard-ats-score-ring':      'SVG circular score ring with gradient stroke',
  'jobboard-ats-category-bar':    'Category breakdown row with label and progress bar',
  'jobboard-keyword-item':        'Single keyword row with dot, hint and status badge',
  'jobboard-keyword-status':      'Found / Missing / Weak status pill',
  'jobboard-ai-suggestion-bar':   'Pulsing AI suggestion nav strip above editor',
  'jobboard-download-section':    'Export options panel (PDF / DOCX / Markdown)',
  'jobboard-dl-btn':              'Download/export action button row',

  // ── COVER LETTER ─────────────────────────────────────────────────
  'jobboard-cover-editor':        'Rich text editor for cover letter',
  'jobboard-cover-toolbar':       'Formatting toolbar for cover letter editor',
  'jobboard-tone-chip':           'Selectable writing tone chip (Profissional / Direto…)',
  'jobboard-ai-regen-btn':        'Gradient "Regenerar" AI generation button',
  'jobboard-struct-item':         'Numbered structure guide item',

  // ── VIDEO SCRIPT ─────────────────────────────────────────────────
  'jobboard-script-scene':        'Single scene block with label, time and script text',
  'jobboard-scene-notes':         'Italic tip/note below scene text',
  'jobboard-tip-item':            'Icon + text tip row in side panel',
  'jobboard-duration-chip':       'Duration selection pill (60s / 90s / 2min)',

  // ── LANDING PAGE ─────────────────────────────────────────────────
  'jobboard-landing-nav':         'Transparent-to-white sticky landing navigation',
  'jobboard-hero-section':        'Full-viewport dark hero with orbs, grid and stats',
  'jobboard-hero-orb':            'Blurred animated gradient orb background element',
  'jobboard-hero-eyebrow':        'Live-dot badge above hero headline',
  'jobboard-hero-stats':          'Horizontal stat group with separators',
  'jobboard-feature-card':        'Feature grid card with icon, title and tag',
  'jobboard-how-it-works':        'Step list + visual mockup 2-col section',
  'jobboard-step-row':            'Numbered step item in how-it-works list',
  'jobboard-testimonial-card':    'Quote + author testimonial card',
  'jobboard-cta-band':            'Full-width dark gradient CTA section',
  'jobboard-footer':              'Dark footer with logo, links and copyright',

  // ── AUTH ─────────────────────────────────────────────────────────
  'jobboard-auth-layout':         '2-col auth page (decorative left + form right)',
  'jobboard-auth-left':           'Dark gradient decorative left panel with feature list',
  'jobboard-auth-left-features':  'Bulleted feature list inside auth left panel',
  'jobboard-social-proof':        'Stacked avatars + text social proof element',
  'jobboard-auth-form':           'Right panel auth form container',
  'jobboard-social-login-btn':    'OAuth provider login button (Google/LinkedIn/GitHub)',
  'jobboard-divider-or':          'Horizontal "ou com e-mail" divider',
  'jobboard-password-strength':   'Color bar + label password strength indicator',
  'jobboard-register-steps':      'Inline 3-step register progress indicator',
  'jobboard-terms-row':           'Checkbox + terms-of-service text row',
  'jobboard-submit-btn':          'Full-width auth form submit button',
  'jobboard-lang-modal':          'Language picker modal (PT-BR / EN)',
  'jobboard-lang-card':           'Selectable language option card in modal',

  // ── SHARED PRIMITIVES ─────────────────────────────────────────────
  'jobboard-badge':               'Generic status badge / pill',
  'jobboard-tag':                 'Colored category tag',
  'jobboard-score-ring':          'Generic SVG score ring (reused in ATS + profile)',
  'jobboard-inline-badge':        'Inline count badge on tabs or alerts',
} as const;


// ─── DEFAULT EXPORT ───────────────────────────────────────────────

const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  gradients,
  animation,
  breakpoints,
  zIndex,
  sizing,
  layout,
  antdTokens,
  antdComponents,
  storybookTheme,
  componentInventory,
  generateCSSVars,
} as const;

export default theme;

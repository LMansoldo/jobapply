/**
 * @file colors.ts
 * @description Centralized color palette. All components must import colors from here.
 */

/** Core brand and semantic color tokens */
export const Colors = {
  // Brand — primary purple ramp
  primary: '#a78bfa',
  primaryDark: '#7c3aed',
  primaryDeeper: '#5b21b6',
  primaryLight: '#ede9fe',
  primaryMid: '#c4b5fd',

  // Secondary / accent
  secondary: '#00fdcf',
  accent: '#f0abfc',
  accentPink: '#fb7185',

  // Semantic
  info: '#60a5fa',
  infoBg: '#dbeafe',
  success: '#34d399',
  successBg: '#d1fae5',
  danger: '#f87171',
  dangerBg: '#fef2f2',
  warning: '#fbbf24',
  warningBg: '#fef3c7',
  orange: '#fb923c',
  orangeBg: '#ffedd5',
  green: '#34d399',
  greenBg: '#d1fae5',
  blue: '#60a5fa',
  blueBg: '#dbeafe',
  gold: 'gold',

  // Text
  textMain: '#1e1b2e',
  textSub: '#6b7280',
  textPrimary: '#1a1a1a',
  textBase: '#222222',
  textSecondary: '#333',
  textBody: '#444',
  textMuted: '#555',
  textPlaceholder: '#888',
  textDisabled: '#999',
  textLight: '#bbb',
  textHint: '#666',

  // Backgrounds / surfaces
  white: '#ffffff',
  pageBg: '#f5f3ff',
  surfacePage: '#f5f3ff',
  surfaceDark: '#1a0533',
  surfaceDarker: '#13102a',
  surfaceEditor: '#1a1730',
  surfaceEditorBorder: '#2d2850',
  surfaceBorder: '#e9e4fc',
  surfaceLight: '#f5f5f5',
  surfaceCode: '#f6f8fa',
  surfaceSelected: '#f9f6ff',
  surfaceHighlight: '#f5f0ff',
  surfaceSubtle: '#fafafa',

  // Borders
  border: '#d9d9d9',
  borderPurple: '#d3b8ff',
  borderLight: '#e8e8e8',
  borderLighter: '#e0e0e0',
  borderCard: '#f0f0f0',
  borderList: '#f5f5f5',

  // Shadows (raw color values — use Shadows object for full shadow strings)
  shadowXs: 'rgba(0,0,0,0.04)',
  shadowSm: 'rgba(0,0,0,0.06)',
  shadowMd: 'rgba(0,0,0,0.08)',

  // Social
  socialGoogle: '#EA4335',
  socialLinkedin: '#0077B5',
  socialGithub: '#24292F',

  // Gradients
  gradientHeroDark: 'linear-gradient(145deg, #1a0533 0%, #2d1065 40%, #4c1d95 70%, #6d28d9 100%)',
  gradientProfileBanner: 'linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)',
  gradientProgressBar: 'linear-gradient(90deg, #a78bfa, #f0abfc)',
  gradientTailorBtn: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  gradientAiToolbar: 'linear-gradient(90deg, rgba(124,58,237,.15) 0%, rgba(240,171,252,.08) 100%)',
  gradientBrandText: 'linear-gradient(90deg, #c4b5fd, #f0abfc, #fb7185)',
} as const

export type ColorKey = keyof typeof Colors

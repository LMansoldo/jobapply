/**
 * @file colors.ts
 * @description Centralized color palette. All components must import colors from here.
 */

/** Core brand and semantic color tokens */
export const Colors = {
  // Brand
  primary: '#814efa',
  secondary: '#00fdcf',
  // Semantic
  info: '#1677ff',
  success: '#52c41a',
  danger: 'red',
  gold: 'gold',
  // Text
  textPrimary: '#1a1a1a',
  textBase: '#222222',
  textSecondary: '#333',
  textBody: '#444',
  textMuted: '#555',
  textPlaceholder: '#888',
  textDisabled: '#999',
  textLight: '#bbb',
  textHint: '#666',
  // Backgrounds
  white: '#ffffff',
  pageBg: '#f0f2f5',
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
  // Shadows
  shadowXs: 'rgba(0,0,0,0.04)',
  shadowSm: 'rgba(0,0,0,0.06)',
  shadowMd: 'rgba(0,0,0,0.08)',
} as const

export type ColorKey = keyof typeof Colors

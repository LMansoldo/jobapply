import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export const atsGrid = css({
  display: 'grid',
  gridTemplateColumns: '1fr 25vw',
  // '1fr' gives the single row a definite height equal to the grid's height,
  // so that height:100% on child cells (Editor, ExportPanel) works correctly.
  gridTemplateRows: '1fr',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',

  '@media (max-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    minHeight: 'auto',
    height: 'auto',
  },
})

export const atsCenter = css({
  background: Colors.surfaceEditor,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0,

  // On narrow tablets (476-768px) the grid becomes flex-column, so the editor
  // should scroll naturally rather than being clipped.
  '@media (max-width: 768px)': {
    overflow: 'visible',
    minHeight: 'auto',
    height: 'auto',
  },
})

export const suggestionBannerPad = css({
  padding: `${Spacing.sm} ${Spacing.lg}`,
  flexShrink: 0,
})

export const suggestionCard = css({
  margin: `0 ${Spacing.lg} ${Spacing.sm}`,
  background: 'rgba(124, 58, 237, 0.06)',
  border: '1px solid rgba(124, 58, 237, 0.18)',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.md}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  flexShrink: 0,
})

export const suggestionCardModal = css({
  marginTop: Spacing.md,
  background: 'rgba(124, 58, 237, 0.06)',
  border: '1px solid rgba(124, 58, 237, 0.18)',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.md}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  flexShrink: 0,
})

export const suggestionCardIcon = css({
  fontSize: '1.4rem',
  lineHeight: '2rem',
  flexShrink: 0,
})

export const suggestionCardText = css({
  fontSize: FontSize.sm,
  color: 'rgba(124, 58, 237, 0.9)',
  fontFamily: FontFamily.body,
  lineHeight: '1.5',
  flex: 1,
})

export const keywordsArea = css({
  padding: `${Spacing.xs} ${Spacing.lg}`,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: `${Spacing.xs}`,
  overflowY: 'scroll',
  maxHeight: '15vh',
})

export const keywordsRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  alignItems: 'center',
})

export const keywordsLabel = css({
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.45)',
  fontFamily: FontFamily.mono,
  flexShrink: 0,
})

export const keywordChipAdd = css({
  background: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.35)',
  borderRadius: '4px',
  color: 'rgba(239, 68, 68, 0.85)',
  fontSize: FontSize.xxs,
  fontFamily: FontFamily.mono,
  padding: '2px 8px',
  cursor: 'pointer',
  lineHeight: '1.6',
  ':hover': { background: 'rgba(239, 68, 68, 0.22)' },
})

export const keywordChipRephrase = css({
  background: 'rgba(245, 158, 11, 0.12)',
  border: '1px solid rgba(245, 158, 11, 0.35)',
  borderRadius: '4px',
  color: 'rgba(245, 158, 11, 0.85)',
  fontSize: FontSize.xxs,
  fontFamily: FontFamily.mono,
  padding: '2px 8px',
  cursor: 'pointer',
  lineHeight: '1.6',
  ':hover': { background: 'rgba(245, 158, 11, 0.22)' },
})

export const tailoringSpinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

export const desktopOnly = css({
  '@media (max-width: 768px)': {
    display: 'none !important',
  },
})

export const mobileOnly = css({
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'block',
  },
})

export const modalContent = css({
  color: 'rgba(255,255,255,0.9)',
})

export const suggestionsButtonWrapper = css({
  padding: `0 ${Spacing.lg} ${Spacing.sm}`,
  display: 'flex',
  justifyContent: 'center',
})
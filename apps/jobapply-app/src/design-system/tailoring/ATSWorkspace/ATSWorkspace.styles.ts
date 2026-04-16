import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export const atsGrid = css({
  display: 'grid',
  gridTemplateColumns: '25vw 1fr 25vw',
  gridTemplateRows: 'auto',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',

  // Responsivo: quebra para 2 linhas
  '@media (max-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: '30vw 1fr', // duas colunas iguais na primeira linha
    gridTemplateRows: '100vh',   // duas linhas automáticas                    // espaçamento entre células
    overflow: 'scroll',
    minHeight: 'auto',

    // Primeiro elemento: coluna 1 da linha 1
    '> :first-child': {
      gridColumn: '1 / 2',
      gridRow: '1',
    },

    // Segundo elemento: coluna 2 da linha 1
    '> :nth-child(2)': {
      gridColumn: '2 / 3',
      gridRow: '1',
    },

    // Terceiro elemento: ocupa as duas colunas da linha 2
    '> :nth-child(3)': {
      gridColumn: '1 / 3',
      gridRow: '2',
    },
  },

  '@media (max-width: 475px)': {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    minHeight: 'auto',
    height: 'auto',
    gap: '0',

    '> :first-child': {
      order: 3,
      height: '40vh',
      overflow: 'auto',
      flexShrink: 0,
    },

    '> :nth-child(2)': {
      order: 1,
      height: 'auto',
      minHeight: '50vh',
      maxHeight: '70vh',
      overflow: 'visible',
      flexShrink: 0,
    },

    '> :nth-child(3)': {
      order: 2,
      height: '50vh',
      overflow: 'auto',
      flexShrink: 0,
    },
  },
})

export const atsLeft = css({
  background: Colors.white,
  borderRight: `1px solid ${Colors.surfaceBorder}`,
  overflowY: 'auto',
  padding: Spacing.lg,
})

export const atsScoreBadge = css({
  background: Colors.successBg,
  color: Colors.success,
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.md}`,
  textAlign: 'center',
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  marginTop: Spacing.md,
})

export const reanalyzeWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  marginTop: Spacing.md,
})

export const atsCenter = css({
  background: Colors.surfaceEditor,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0,

  '@media (max-width: 475px)': {
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
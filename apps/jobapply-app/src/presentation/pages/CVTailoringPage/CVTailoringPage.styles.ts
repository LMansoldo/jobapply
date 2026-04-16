import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { mediaQueries } from '../../../styles/theme/breakpoints'

export const pageRoot = css({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 5.6rem)',
  overflow: 'hidden',

  [mediaQueries.tabletDown]: {
    height: 'auto',
    minHeight: 'calc(100vh - 11.2rem)',
    overflow: 'visible',
  },
})

export const spinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60vh',
})

export const contextBar = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  flexShrink: 0,
})

export const backBtn = css({
  background: 'none',
  border: 'none',
  color: Colors.primaryDark,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  fontFamily: FontFamily.body,
})

export const contextDivider = css({
  width: '1px',
  height: '2rem',
  background: Colors.surfaceBorder,
})

export const analysisStatus = css({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
})

export const analysisDot = css({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: Colors.success,
  flexShrink: 0,
})

export const analysisDotRunning = css({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: Colors.orange,
  flexShrink: 0,
  animation: 'pulse 1.2s ease-in-out infinite',
})

export const analysisLabel = css({
  fontSize: FontSize.sm,
  color: Colors.success,
  fontWeight: FontWeight.medium,
})

export const analysisLabelRunning = css({
  fontSize: FontSize.sm,
  color: Colors.orange,
  fontWeight: FontWeight.medium,
})

export const workspaceTabs = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `0 ${Spacing.md}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  flexShrink: 0,
  overflowX: 'auto',
  '-webkit-overflow-scrolling': 'touch',

  [mediaQueries.md]: {
    padding: `0 ${Spacing.lg}`,
  },
})

export const tabBtn = (active: boolean) => css({
  padding: `${Spacing.sm} ${Spacing.md}`,
  border: 'none',
  background: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: active ? Colors.primaryDark : Colors.textSub,
  cursor: 'pointer',
  borderBottom: `2px solid ${active ? Colors.primary : 'transparent'}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  whiteSpace: 'nowrap',
  transition: 'color .15s, border-color .15s',
})

export const tabBadge = (bg: string, color: string) => css({
  background: bg,
  color,
  borderRadius: '10px',
  padding: `0 ${Spacing.xs}`,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
})

export const atsGrid = css({
  display: 'grid',
  // Mobile: 1 column (full width editor)
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr auto',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',

  // Tablet: 2 columns (ATS hidden in drawer, editor + preview)
  [mediaQueries.md]: {
    gridTemplateColumns: '1fr 30rem',
    gridTemplateRows: '1fr',
  },

  // Desktop: 3 columns (ATS + editor + preview)
  [mediaQueries.lg]: {
    gridTemplateColumns: '25rem 1fr 50rem',
    gridTemplateRows: '1fr',
  },
})

export const atsLeft = css({
  background: Colors.white,
  borderRight: `1px solid ${Colors.surfaceBorder}`,
  overflowY: 'auto',
  padding: Spacing.lg,
  display: 'none',

  [mediaQueries.lg]: {
    display: 'block',
  },
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
})

export const atsCenterToolbar = css({
  background: Colors.surfaceDarker,
  borderBottom: `1px solid ${Colors.surfaceEditorBorder}`,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  flexShrink: 0,
})

export const toolbarMonoLabel = css({
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.5)',
  fontFamily: FontFamily.mono,
})

export const toolbarBtns = css({
  marginLeft: 'auto',
  display: 'flex',
  gap: Spacing.sm,
})

export const acceptAllBtn = css({
  background: Colors.success,
  border: 'none',
  borderRadius: '6px',
  color: Colors.white,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  padding: `3px ${Spacing.sm}`,
  cursor: 'pointer',
  fontFamily: FontFamily.body,
})

export const rejectAllBtn = css({
  background: Colors.danger,
  border: 'none',
  borderRadius: '6px',
  color: Colors.white,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  padding: `3px ${Spacing.sm}`,
  cursor: 'pointer',
  fontFamily: FontFamily.body,
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
  gap: Spacing.xs,
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

export const editorArea = css({
  flex: 1,
  overflow: 'auto',
  padding: `0 ${Spacing.lg} ${Spacing.lg}`,
})

export const tailoringSpinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

export const editorTextarea = css({
  width: '100%',
  minHeight: '40rem',
  background: 'transparent',
  color: 'rgba(255,255,255,0.9)',
  fontFamily: FontFamily.mono,
  fontSize: FontSize.sm,
  border: `1px solid ${Colors.surfaceEditorBorder}`,
  borderRadius: BorderRadius.base,
  padding: Spacing.lg,
  boxSizing: 'border-box',
  lineHeight: '1.75',
  outline: 'none',
  resize: 'none',
})

export const statusBar = css({
  background: Colors.surfaceDarker,
  borderTop: `1px solid ${Colors.surfaceEditorBorder}`,
  padding: `${Spacing.xs} ${Spacing.lg}`,
  display: 'flex',
  gap: Spacing.lg,
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.4)',
  fontFamily: FontFamily.mono,
  flexShrink: 0,
})

export const statusBarRight = css({
  marginLeft: 'auto',
})

export const coverGrid = css({
  flex: 1,
  display: 'grid',
  // Mobile: 1 column (editor full width)
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr auto',
  overflow: 'hidden',

  // Tablet and up: 2 columns (editor + sidebar)
  [mediaQueries.md]: {
    gridTemplateColumns: '1fr 30rem',
    gridTemplateRows: '1fr',
  },
})

export const coverEditorPane = css({
  padding: Spacing.lg,
  overflowY: 'auto',
  background: Colors.white,
})

export const coverEditorBorder = css({
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  overflow: 'hidden',
})

export const coverTextarea = css({
  width: '100%',
  minHeight: '24rem',
  padding: Spacing.lg,
  border: 'none',
  outline: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  lineHeight: '1.75',
  color: Colors.textMain,
  resize: 'none',
  background: 'transparent',

  [mediaQueries.md]: {
    minHeight: '36rem',
  },
})

export const coverSidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  background: Colors.surfacePage,
  overflowY: 'auto',
  borderLeftWidth: 0,
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: Colors.surfaceBorder,

  [mediaQueries.md]: {
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
})

export const aiCard = css({
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  padding: Spacing.lg,
  marginBottom: Spacing.md,
})

export const aiCardTitle = css({
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  margin: `0 0 ${Spacing.md}`,
  color: Colors.primaryDark,
})

export const aiGenBtn = css({
  width: '100%',
  marginTop: Spacing.md,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.base,
  padding: Spacing.sm,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  cursor: 'pointer',
})

export const videoGrid = css({
  flex: 1,
  display: 'grid',
  // Mobile: 1 column (editor full width)
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr auto',
  overflow: 'hidden',

  // Tablet and up: 2 columns (editor + sidebar)
  [mediaQueries.md]: {
    gridTemplateColumns: '1fr 30rem',
    gridTemplateRows: '1fr',
  },
})

export const videoEditorPane = css({
  padding: Spacing.lg,
  overflowY: 'auto',
  background: Colors.white,
})

export const videoTextarea = css({
  width: '100%',
  minHeight: '30rem',
  padding: Spacing.lg,
  border: 'none',
  outline: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  lineHeight: '1.75',
  color: Colors.textMain,
  resize: 'none',
  background: 'transparent',

  [mediaQueries.md]: {
    minHeight: '48rem',
  },
})

export const videoSidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  background: Colors.surfacePage,
  overflowY: 'auto',
  borderLeftWidth: 0,
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: Colors.surfaceBorder,

  [mediaQueries.md]: {
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
})

export const videoScriptBtn = css({
  width: '100%',
  marginBottom: Spacing.md,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.base,
  padding: Spacing.sm,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  cursor: 'pointer',
})

// ── Setup dialog (2-step locale + job description) ───────────────────────────

export const setupSteps = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  marginBottom: Spacing.lg,
})

export const setupStepDot = (active: boolean) => css({
  width: '2.4rem',
  height: '2.4rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  flexShrink: 0,
  background: active ? Colors.primaryDark : Colors.surfaceBorder,
  color: active ? Colors.white : Colors.textSub,
  transition: 'background 0.2s',
})

export const setupStepLine = css({
  flex: 1,
  height: '1px',
  background: Colors.surfaceBorder,
})

export const setupStepLabel = (active: boolean) => css({
  fontSize: FontSize.xxs,
  color: active ? Colors.primaryDark : Colors.textSub,
  fontWeight: active ? FontWeight.semibold : FontWeight.regular,
  flexShrink: 0,
})

export const setupSectionTitle = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  margin: `0 0 ${Spacing.sm}`,
})

export const setupLocaleRow = css({
  display: 'flex',
  gap: Spacing.md,
  marginTop: Spacing.sm,
})

export const setupLocaleBtn = (active: boolean) => css({
  flex: 1,
  padding: `${Spacing.md} ${Spacing.lg}`,
  border: `2px solid ${active ? Colors.primaryDark : Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  background: active ? Colors.primaryLight : Colors.white,
  color: active ? Colors.primaryDark : Colors.textMain,
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  textAlign: 'center' as const,
  transition: 'all 0.15s',
  ':hover': { borderColor: Colors.primaryDark, background: Colors.primaryLight },
})

export const setupTip = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.sm,
  background: 'rgba(245,158,11,0.08)',
  border: '1px solid rgba(245,158,11,0.3)',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.md}`,
  marginBottom: Spacing.md,
})

export const setupTipText = css({
  fontSize: FontSize.sm,
  color: Colors.orange,
  lineHeight: '1.5',
  margin: 0,
})

export const setupJdTextarea = css({
  width: '100%',
  minHeight: '22rem',
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  padding: Spacing.md,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  lineHeight: '1.6',
  color: Colors.textMain,
  outline: 'none',
  resize: 'vertical' as const,
  boxSizing: 'border-box' as const,
  ':focus': { borderColor: Colors.primaryDark },
})

export const setupModalFooter = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: Spacing.lg,
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  marginTop: Spacing.lg,
})

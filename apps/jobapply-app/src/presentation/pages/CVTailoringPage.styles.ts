import { css } from '@emotion/css'
import { Colors } from '../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../styles/theme/typography'
import { Spacing } from '../../styles/theme/spacing'
import { BorderRadius } from '../../styles/theme/radius'

export const pageRoot = css({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 6.4rem)',
  overflow: 'hidden',
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

export const analysisLabel = css({
  fontSize: FontSize.sm,
  color: Colors.success,
  fontWeight: FontWeight.medium,
})

export const workspaceTabs = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `0 ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  flexShrink: 0,
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
  gridTemplateColumns: '25rem 1fr 30rem',
  flex: 1,
  overflow: 'hidden',
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

export const atsCenter = css({
  background: Colors.surfaceEditor,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
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
  gridTemplateColumns: '1fr 30rem',
  overflow: 'hidden',
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
  minHeight: '36rem',
  padding: Spacing.lg,
  border: 'none',
  outline: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  lineHeight: '1.75',
  color: Colors.textMain,
  resize: 'none',
  background: 'transparent',
})

export const coverSidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  background: Colors.surfacePage,
  overflowY: 'auto',
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
  gridTemplateColumns: '1fr 30rem',
  overflow: 'hidden',
})

export const videoEditorPane = css({
  padding: Spacing.lg,
  overflowY: 'auto',
  background: Colors.white,
})

export const videoTextarea = css({
  width: '100%',
  minHeight: '48rem',
  padding: Spacing.lg,
  border: 'none',
  outline: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  lineHeight: '1.75',
  color: Colors.textMain,
  resize: 'none',
  background: 'transparent',
})

export const videoSidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  background: Colors.surfacePage,
  overflowY: 'auto',
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

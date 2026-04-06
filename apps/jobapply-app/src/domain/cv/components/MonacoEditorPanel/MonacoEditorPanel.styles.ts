import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { BorderRadius } from '../../../../styles/theme/radius'

export const root = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
})

export const cardHeader = css({
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderBottom: 'none',
  borderRadius: `${BorderRadius.base} ${BorderRadius.base} 0 0`,
  padding: `${Spacing.md} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const headerLeft = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
})

export const headerTitle = css({
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.base,
  color: Colors.textMain,
})

export const optionalBadge = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  background: Colors.infoBg,
  color: Colors.info,
  padding: `1px ${Spacing.sm}`,
  borderRadius: '10px',
})

export const localeBadge = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  background: Colors.primaryLight,
  color: Colors.primaryDark,
  padding: `1px ${Spacing.sm}`,
  borderRadius: '10px',
})

export const wordCountLabel = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
})

export const chipsBar = css({
  background: Colors.surfaceLight,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderBottom: 'none',
  padding: `${Spacing.sm} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  overflowX: 'auto',
})

export const chipsGoToLabel = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  whiteSpace: 'nowrap',
  fontWeight: FontWeight.medium,
})

export const sectionChip = css({
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: '12px',
  padding: `2px ${Spacing.sm}`,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.medium,
  color: Colors.textSub,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: FontFamily.body,
  transition: 'border-color 0.15s, color 0.15s',
})

export const translateBtn = css({
  marginLeft: 'auto',
  background: Colors.primaryLight,
  border: 'none',
  borderRadius: '12px',
  padding: `2px ${Spacing.md}`,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: FontFamily.body,
})

export const toolbarRow = css({
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderBottom: 'none',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const toolbarRowRight = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  paddingRight: Spacing.md,
})

export const toolbarRow2 = css({
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderBottom: 'none',
  padding: 0,
})

export const editorAreaRelative = css({
  position: 'relative',
})

export const mobileBorder = css({
  border: `1px solid ${Colors.surfaceBorder}`,
  overflow: 'hidden',
})

export const mobileEditorHeight = css({
  height: Spacing.editorHeightMobile,
})

export const mobilePreviewPane = css({
  height: '100%',
  overflowY: 'auto',
  padding: `${Spacing.md2} ${Spacing.md}`,
  background: Colors.white,
})

export const desktopTabsBar = css({
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderBottom: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 0,
})

export const previewTabBtn = (active: boolean) => css({
  padding: `${Spacing.sm} ${Spacing.md}`,
  border: 'none',
  background: 'none',
  fontSize: FontSize.sm,
  fontWeight: active ? FontWeight.semibold : FontWeight.regular,
  color: active ? Colors.primaryDark : Colors.textSub,
  borderBottom: `2px solid ${active ? Colors.primaryDark : 'transparent'}`,
  cursor: 'pointer',
  fontFamily: FontFamily.body,
})

export const splitPane = (height: number) => css({
  display: 'flex',
  height,
  border: `1px solid ${Colors.surfaceBorder}`,
  overflow: 'hidden',
})

export const editorHalf = css({
  width: '50%',
  borderRight: `1px solid ${Colors.surfaceBorder}`,
})

export const previewHalf = css({
  width: '50%',
  overflowY: 'auto',
  padding: `${Spacing.md} ${Spacing.lg}`,
  background: Colors.white,
})

export const htmlPre = css({
  fontFamily: FontFamily.mono,
  fontSize: FontSize.xxs,
  color: Colors.textMain,
  whiteSpace: 'pre-wrap',
  margin: 0,
})

export const emptyOverlay = css({
  position: 'absolute',
  inset: 0,
  background: 'rgba(26,7,51,0.88)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.md,
  zIndex: 10,
})

export const overlayTitle = css({
  margin: 0,
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: FontSize.xl,
  color: Colors.white,
  textAlign: 'center',
})

export const overlaySubtitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  color: 'rgba(255,255,255,0.7)',
  textAlign: 'center',
  maxWidth: '40rem',
})

export const overlayBtns = css({
  display: 'flex',
  gap: Spacing.md,
  marginTop: Spacing.sm,
})

export const overlayPrimaryBtn = css({
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.full,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  cursor: 'pointer',
})

export const overlayGhostBtn = css({
  background: 'rgba(255,255,255,0.15)',
  color: Colors.white,
  border: '1.5px solid rgba(255,255,255,0.4)',
  borderRadius: BorderRadius.full,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  cursor: 'pointer',
})

export const statusBar = css({
  background: Colors.surfaceEditor,
  borderRadius: `0 0 ${BorderRadius.base} ${BorderRadius.base}`,
  padding: `${Spacing.xs} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.lg,
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.5)',
  fontFamily: FontFamily.mono,
  border: `1px solid ${Colors.surfaceEditorBorder}`,
  borderTop: 'none',
})

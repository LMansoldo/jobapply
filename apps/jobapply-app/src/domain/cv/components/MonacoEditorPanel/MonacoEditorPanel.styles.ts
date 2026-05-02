import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { BorderRadius } from '../../../../styles/theme/radius'

const BTN_SIZE = '2.6rem'
const STATUS_HEIGHT = '2.4rem'

const MOBILE = '@media (max-width: 767px)'
const SMALL_MOBILE = '@media (max-width: 767px) and (max-height: 680px)'

export const root = css({
  display: 'flex',
  flexDirection: 'column',
  background: Colors.surfaceEditor,
  borderRadius: BorderRadius.base,
  overflow: 'hidden',
  [MOBILE]: {
    borderRadius: 0,
  },
})

export const toolbar = css({
  background: Colors.surfaceDarker,
  borderBottom: `1px solid ${Colors.surfaceEditorBorder}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: `${Spacing.sm} ${Spacing.md}`,
  gap: Spacing.xs,
  flexShrink: 0,
})

export const toolbarHeaderRow = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

export const toolbarHeaderLeft = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
})

export const localeBadge = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  background: 'rgba(124,58,237,0.25)',
  color: Colors.primary,
  padding: `1px ${Spacing.sm}`,
  borderRadius: '10px',
})

export const optionalBadge = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  background: 'rgba(96,165,250,0.15)',
  color: Colors.blue,
  padding: `1px ${Spacing.sm}`,
  borderRadius: '10px',
})

export const wordCountLabel = css({
  fontSize: FontSize.xxs,
  color: Colors.white,
  fontFamily: FontFamily.mono,
})

export const toolsRow = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

export const toolbarBtn = (active = false, wide = false) => css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.xxs,
  minWidth: BTN_SIZE,
  height: BTN_SIZE,
  padding: `0 ${wide ? Spacing.sm : Spacing.xs}`,
  border: 'none',
  background: active ? 'rgba(124,58,237,0.25)' : 'transparent',
  color: active ? Colors.primary : 'rgba(255,255,255,0.65)',
  fontSize: FontSize.md0,
  fontWeight: wide ? FontWeight.semibold : FontWeight.regular,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'background 0.12s, color 0.12s',
  ':hover': {
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.9)',
  },
})

export const toolbarDivider = css({
  width: '1px',
  height: '1.6rem',
  background: 'rgba(255,255,255,0.12)',
  margin: `0 ${Spacing.xxs}`,
  flexShrink: 0,
})

export const mobileTabRow = css({
  display: 'flex',
  gap: '2px',
})

export const mobileTabBtn = (active: boolean) => css({
  padding: `${Spacing.xs} ${Spacing.md}`,
  border: `1px solid ${active ? Colors.primary : 'rgba(255,255,255,0.15)'}`,
  background: active ? 'rgba(124,58,237,0.25)' : 'transparent',
  color: active ? Colors.primary : 'rgba(255,255,255,0.5)',
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  borderRadius: BorderRadius.xs,
})

export const splitPane = (height: number) => css({
  display: 'flex',
  height,
  overflow: 'hidden',
})

export const editorHalf = css({
  width: '50%',
  borderRight: `1px solid ${Colors.surfaceEditorBorder}`,
  overflow: 'hidden',
})

export const previewHalf = css({
  width: '50%',
  overflowY: 'auto',
  padding: `${Spacing.md} ${Spacing.lg}`,
  background: Colors.white,
})

const MOBILE_EDITOR_HEIGHT = '52rem'
const SMALL_MOBILE_EDITOR_HEIGHT = '32rem'

export const mobileEditorHeight = css({
  height: MOBILE_EDITOR_HEIGHT,
  overflow: 'hidden',
  [SMALL_MOBILE]: {
    height: SMALL_MOBILE_EDITOR_HEIGHT,
  },
})

export const mobilePreviewPane = css({
  height: MOBILE_EDITOR_HEIGHT,
  [SMALL_MOBILE]: {
    height: SMALL_MOBILE_EDITOR_HEIGHT,
  },
  overflowY: 'auto',
  padding: `${Spacing.md2} ${Spacing.md}`,
  background: Colors.white,
})

export const errorBanner = css({
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  borderRadius: 0,
})

export const statusBar = css({
  height: STATUS_HEIGHT,
  background: Colors.surfaceDarker,
  borderTop: `1px solid ${Colors.surfaceEditorBorder}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.lg,
  padding: `0 ${Spacing.lg}`,
  fontFamily: FontFamily.mono,
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.4)',
  flexShrink: 0,
})

export const statusRight = css({
  marginLeft: 'auto',
})

export const editorAreaRelative = css({
  position: 'relative',
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

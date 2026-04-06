import { css } from '@emotion/css'
import { Colors } from '../../styles/theme/colors'
import { Shadows } from '../../styles/theme/shadows'
import { BorderRadius } from '../../styles/theme/radius'
import { Spacing } from '../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../styles/theme/typography'

// ── Left panel — job list ────────────────────────────────────────────────────

export const leftPanel = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
  border: `1px solid ${Colors.surfaceBorder}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
})

export const leftPanelHeader = css({
  padding: `${Spacing.md} ${Spacing.lg}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
})

export const leftPanelTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.base,
  color: Colors.textMain,
  margin: '0 0 2px',
})

export const leftPanelSubtitle = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  margin: 0,
})

export const countRow = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Spacing.sm} ${Spacing.lg}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
})

export const countText = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  margin: 0,
})

export const countBold = css({
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
})

export const jobListScroll = css({
  overflowY: 'auto',
  flex: 1,
  maxHeight: 'calc(100vh - 22rem)',
})

export const spinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  padding: Spacing.xxl,
})

// ── Center panel — job detail ────────────────────────────────────────────────

export const centerScroll = css({
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 14rem)',
})

export const emptyDetail = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
  border: `1px solid ${Colors.surfaceBorder}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: Spacing.xxl,
  textAlign: 'center',
  color: Colors.textSub,
  gap: Spacing.md,
  minHeight: '32rem',
})

// ── Right panel ──────────────────────────────────────────────────────────────

export const rightPanelWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

// ── Mobile ───────────────────────────────────────────────────────────────────

export const mobilePadding = css({
  padding: Spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const mobileModalHeader = (white: string, border: string) => css({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: white,
  borderBottom: `1px solid ${border}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
})

export const mobileModalBody = css({
  padding: Spacing.md,
})

export const mobileJobTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  color: Colors.textMain,
})

export const mobileJobCompany = css({
  color: Colors.textSub,
  fontSize: FontSize.sm,
})

export const mobileJobDescription = css({
  color: Colors.textMain,
  lineHeight: 1.7,
})

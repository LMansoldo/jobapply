import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { Shadows } from '../../../styles/theme/shadows'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'

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
  maxHeight: 'calc(100vh - 44rem)',
})

export const spinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  padding: Spacing.xxl,
})

// ── Center panel — job detail ────────────────────────────────────────────────

export const centerScroll = css({

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

// ── Empty detail placeholder ──────────────────────────────────────────────────
const EMPTY_ICON_SIZE = '3.6rem'   // 36px
const EMPTY_TEXT_SIZE = FontSize.md // 1.4rem = 14px

export const emptyIcon = css({
  fontSize: EMPTY_ICON_SIZE,
})

export const emptyText = css({
  margin: 0,
  fontSize: EMPTY_TEXT_SIZE,
  color: Colors.textSub,
})

export const emptyWrapper = css({
  padding: Spacing.xxl,
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

export const mobileModalHeader = css({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
})

// AntD Modal positioning constants (style prop required for dialog placement)
export const mobileModalStyle = { top: 0, margin: 0, maxWidth: '100vw', padding: 0 } as const
export const mobileModalStyles = {
  content: { borderRadius: 0, padding: 0, minHeight: '100dvh' },
  body: { padding: 0 },
} as const

export const mobileModalBody = css({
  padding: Spacing.md,
})

export const backBtnText = css({
  '&.ant-btn': {
    fontWeight: FontWeight.medium,
  },
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

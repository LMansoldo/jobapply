import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'

export const card = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
  border: `1px solid ${Colors.surfaceBorder}`,
  overflow: 'hidden',
  marginBottom: Spacing.lg,
})

export const banner = css({
  height: '6rem',
  background: Colors.gradientProfileBanner,
  position: 'relative',
})

export const menuBtnsRow = css({
  position: 'absolute',
  top: Spacing.sm,
  right: Spacing.md,
  display: 'flex',
  gap: Spacing.sm,
})

export const menuBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  background: 'rgba(255,255,255,0.92)',
  border: 'none',
  borderRadius: BorderRadius.full,
  padding: `${Spacing.xs} ${Spacing.md}`,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  cursor: 'pointer',
  boxShadow: Shadows.sm,
  transition: 'background 0.15s',
  '&:hover': { background: Colors.white },
})

export const menuBtnBadge = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: Colors.primaryDark,
  color: Colors.white,
  borderRadius: BorderRadius.full,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  minWidth: '1.8rem',
  height: '1.8rem',
  padding: `0 4px`,
  lineHeight: 1,
})

export const body = css({
  padding: `0 ${Spacing.xl} ${Spacing.lg}`,
})

export const profileRow = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: Spacing.lg,
  marginTop: `-2.4rem`,
})

export const avatar = css({
  width: '5.6rem',
  height: '5.6rem',
  borderRadius: BorderRadius.avatar,
  background: Colors.primaryDark,
  border: `3px solid ${Colors.white}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: '2.0rem',
  color: Colors.white,
  boxShadow: Shadows.avatar,
  flexShrink: 0,
})

export const profileInfo = css({
  flex: 1,
  minWidth: 0,
  paddingTop: Spacing.md,
})

export const profileName = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.base,
  color: Colors.textMain,
  margin: '0 0 2px',
})

export const profileEmail = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
  margin: 0,
})

export const statsRow = css({
  display: 'flex',
  alignItems: 'stretch',
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.md} 0`,
  margin: `${Spacing.md} 0`,
})

export const statItem = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
})

export const statDivider = css({
  width: '1px',
  background: Colors.surfaceBorder,
  flexShrink: 0,
})

export const statValue = css({
  fontSize: FontSize.xl,
  fontWeight: FontWeight.bold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.heading,
})

export const statLabel = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  textAlign: 'center' as const,
})

export const progressSection = css({
  marginBottom: Spacing.md,
})

export const progressLabel = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: Spacing.xs,
})

export const progressLabelText = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
})

export const progressLabelValue = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
})

export const viewProfileBtn = css({
  width: '100%',
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.full,
  padding: `${Spacing.sm} 0`,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.88 },
})

// ── Filter strip ────────────────────────────────────────────────────────────

export const filterStrip = css({
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.md} ${Spacing.xl}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  flexWrap: 'wrap' as const,
})

export const filterDivider = css({
  width: '1px',
  height: '2rem',
  background: Colors.surfaceBorder,
  flexShrink: 0,
})

export const filterChip = (active: boolean) => css({
  display: 'inline-flex',
  alignItems: 'center',
  background: active ? Colors.primaryDark : Colors.white,
  color: active ? Colors.white : Colors.textSub,
  border: `1px solid ${active ? Colors.primaryDark : Colors.surfaceBorder}`,
  borderRadius: BorderRadius.full,
  padding: `3px ${Spacing.md}`,
  fontSize: FontSize.sm,
  fontWeight: active ? FontWeight.semibold : FontWeight.regular,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'all 0.15s',
  '&:hover': {
    borderColor: Colors.primaryDark,
    color: active ? Colors.white : Colors.primaryDark,
  },
})

export const clearBtn = css({
  background: 'none',
  border: 'none',
  color: Colors.textSub,
  fontSize: FontSize.sm,
  cursor: 'pointer',
  fontFamily: FontFamily.body,
  padding: `3px ${Spacing.sm}`,
  marginLeft: 'auto',
  '&:hover': { color: Colors.danger },
})

// ── Dropdown panels ─────────────────────────────────────────────────────────

export const dropPanel = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.lg,
  border: `1px solid ${Colors.surfaceBorder}`,
  width: '30rem',
  overflow: 'hidden',
})

export const dropPanelHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Spacing.md} ${Spacing.lg}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
})

export const dropPanelTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  color: Colors.textMain,
  margin: 0,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
})

export const newAlertBtn = css({
  background: 'none',
  border: `1px solid ${Colors.primaryDark}`,
  borderRadius: BorderRadius.full,
  color: Colors.primaryDark,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  padding: `2px ${Spacing.sm}`,
  cursor: 'pointer',
  fontFamily: FontFamily.body,
})

export const dropPanelBody = css({
  padding: `${Spacing.sm} 0`,
})

export const alertItem = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  cursor: 'pointer',
  transition: 'background 0.12s',
  '&:hover': { background: Colors.surfacePage },
})

export const alertIcon = css({
  width: '3.6rem',
  height: '3.6rem',
  borderRadius: BorderRadius.full,
  background: Colors.primaryLight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.8rem',
  flexShrink: 0,
})

export const alertContent = css({
  flex: 1,
  minWidth: 0,
})

export const alertTitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  lineHeight: 1.3,
})

export const alertSubtitle = css({
  margin: '2px 0 0',
  fontSize: FontSize.xxs,
  color: Colors.textSub,
})

export const alertBadge = css({
  background: Colors.primaryDark,
  color: Colors.white,
  borderRadius: BorderRadius.full,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  padding: `2px ${Spacing.sm}`,
  minWidth: '2.4rem',
  textAlign: 'center' as const,
  flexShrink: 0,
})

export const newsItem = css({
  display: 'flex',
  gap: Spacing.md,
  alignItems: 'flex-start',
  padding: `${Spacing.sm} ${Spacing.lg}`,
  cursor: 'pointer',
  transition: 'background 0.12s',
  '&:hover': { background: Colors.surfacePage },
})

export const newsThumbnail = css({
  width: '5.2rem',
  height: '4rem',
  background: Colors.surfacePage,
  borderRadius: BorderRadius.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  flexShrink: 0,
})

export const newsContent = css({
  flex: 1,
  minWidth: 0,
})

export const newsTitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  color: Colors.textMain,
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
})

export const newsMeta = css({
  margin: '3px 0 0',
  fontSize: FontSize.xxs,
  color: Colors.textSub,
})

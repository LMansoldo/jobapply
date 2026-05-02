import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { Avatar } from '../../../components/Avatar'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'

export const PrimaryAvatar = styled(Avatar)`
  && {
    background: ${Colors.primaryDark};
  }
`

export const avatarWrapper = css({
  position: 'relative',
  display: 'inline-flex',
})

export const alertBubble = css({
  position: 'absolute',
  top: '-0.4rem',
  right: '-0.4rem',
  background: Colors.danger,
  color: Colors.white,
  borderRadius: BorderRadius.avatar,
  fontSize: '0.9rem',
  width: '1.6rem',
  height: '1.6rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: FontWeight.bold,
  pointerEvents: 'none',
})

export const trigger = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  cursor: 'pointer',
  userSelect: 'none',
})

export const triggerName = css({
  color: Colors.textMain,
  fontSize: FontSize.md,
})

// ── Dropdown panel ───────────────────────────────────────────────────────────

export const panel = css({
  width: '28rem',
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.lg,
  border: `1px solid ${Colors.surfaceBorder}`,
  overflow: 'hidden',
})

export const profileSection = css({
  padding: `${Spacing.md} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
})

export const avatar = css({
  width: '4.4rem',
  height: '4.4rem',
  borderRadius: BorderRadius.avatar,
  background: Colors.primaryDark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: FontSize.base,
  color: Colors.white,
  flexShrink: 0,
})

export const profileInfo = css({
  flex: 1,
  minWidth: 0,
})

export const profileName = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  color: Colors.textMain,
  margin: '0 0 2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const profileEmail = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const progressRow = css({
  padding: `${Spacing.sm} ${Spacing.lg}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
})

export const progressLabel = css({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: Spacing.xs,
})

export const progressLabelText = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
})

export const progressLabelValue = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
})

export const viewProfileBtn = css({
  display: 'block',
  width: '100%',
  marginTop: Spacing.sm,
  padding: `${Spacing.xs} 0`,
  background: 'none',
  border: `1px solid ${Colors.primaryDark}`,
  borderRadius: BorderRadius.full,
  color: Colors.primaryDark,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  textAlign: 'center' as const,
  transition: 'background 0.12s',
  '&:hover': { background: Colors.primaryLight },
})

// ── Alerts section ───────────────────────────────────────────────────────────

export const sectionHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Spacing.sm} ${Spacing.lg} ${Spacing.xs}`,
})

export const sectionTitle = css({
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  color: Colors.textSub,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  margin: 0,
})

export const alertItem = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  padding: `${Spacing.xs} ${Spacing.lg}`,
  cursor: 'pointer',
  transition: 'background 0.12s',
  '&:hover': { background: Colors.surfacePage },
})

export const alertIcon = css({
  width: '3rem',
  height: '3rem',
  borderRadius: BorderRadius.full,
  background: Colors.primaryLight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.4rem',
  flexShrink: 0,
})

export const alertContent = css({
  flex: 1,
  minWidth: 0,
})

export const alertTitle = css({
  margin: 0,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.medium,
  color: Colors.textMain,
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const alertBadge = css({
  background: Colors.primaryDark,
  color: Colors.white,
  borderRadius: BorderRadius.full,
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.bold,
  padding: `1px ${Spacing.sm}`,
  minWidth: '2rem',
  textAlign: 'center' as const,
  flexShrink: 0,
})

// ── Footer ───────────────────────────────────────────────────────────────────

export const footer = css({
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.xs} ${Spacing.sm}`,
})

export const footerItem = (danger = false) => css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  padding: `${Spacing.sm} ${Spacing.md}`,
  borderRadius: BorderRadius.sm,
  cursor: 'pointer',
  fontSize: FontSize.sm,
  color: danger ? Colors.danger : Colors.textMain,
  transition: 'background 0.12s',
  '&:hover': { background: danger ? Colors.dangerBg : Colors.surfacePage },
})

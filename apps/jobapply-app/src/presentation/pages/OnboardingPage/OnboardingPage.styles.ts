import { css, keyframes } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { Spacing } from '../../../styles/theme/spacing'
import { FontSize, FontFamily, FontWeight } from '../../../styles/theme/typography'

const typingDot = keyframes`
  0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-0.4rem); }
`

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(0.8rem); }
  to   { opacity: 1; transform: translateY(0); }
`

export const root = css({
  minHeight: '100dvh',
  backgroundColor: Colors.pageBg,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const progressTrack = css({
  width: '100%',
  height: '0.3rem',
  backgroundColor: Colors.borderLight,
  flexShrink: 0,
})

export const progressFill = (pct: number) =>
  css({
    height: '100%',
    width: `${pct}%`,
    background: Colors.gradientProgressBar,
    transition: 'width 0.4s ease',
  })

export const chatArea = css({
  flex: 1,
  width: '100%',
  maxWidth: '72rem',
  padding: `${Spacing.xl} ${Spacing.md}`,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  overflowY: 'auto',
})

export const botRow = css({
  display: 'flex',
  alignItems: 'flex-end',
  gap: Spacing.sm,
  animation: `${fadeSlideIn} 0.3s ease both`,
})

export const botAvatar = css({
  width: '3.2rem',
  height: '3.2rem',
  borderRadius: '50%',
  background: Colors.gradientProgressBar,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: FontSize.sm,
  color: Colors.white,
})

export const botBubble = css({
  backgroundColor: Colors.white,
  border: `1px solid ${Colors.borderCard}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
  maxWidth: '54rem',
  fontSize: FontSize.base,
  fontFamily: FontFamily.body,
  lineHeight: 1.6,
  color: Colors.textMain,
  boxShadow: `0 0.1rem 0.3rem ${Colors.shadowXs}`,
})

export const botBubbleWarning = css({
  backgroundColor: Colors.warningBg,
  border: `1px solid ${Colors.warning}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
  maxWidth: '54rem',
  fontSize: FontSize.base,
  fontFamily: FontFamily.body,
  lineHeight: 1.6,
  color: Colors.textMain,
})

export const userRow = css({
  display: 'flex',
  justifyContent: 'flex-end',
  animation: `${fadeSlideIn} 0.3s ease both`,
})

export const userBubble = css({
  backgroundColor: Colors.primary,
  padding: `${Spacing.sm} ${Spacing.md}`,
  maxWidth: '54rem',
  fontSize: FontSize.base,
  fontFamily: FontFamily.body,
  lineHeight: 1.6,
  color: Colors.white,
  fontWeight: FontWeight.medium,
})

export const typingRow = css({
  display: 'flex',
  alignItems: 'flex-end',
  gap: Spacing.sm,
})

export const typingBubble = css({
  backgroundColor: Colors.white,
  border: `1px solid ${Colors.borderCard}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
})

export const typingDotEl = (delay: number) =>
  css({
    width: '0.7rem',
    height: '0.7rem',
    borderRadius: '50%',
    backgroundColor: Colors.textPlaceholder,
    animation: `${typingDot} 1.2s ease infinite`,
    animationDelay: `${delay}s`,
  })

export const overviewCards = css({
  display: 'flex',
  gap: Spacing.sm,
  flexWrap: 'wrap',
  marginTop: Spacing.xs,
})

export const overviewCard = css({
  flex: '1 1 14rem',
  backgroundColor: Colors.surfaceHighlight,
  border: `1px solid ${Colors.borderPurple}`,
  padding: Spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
})

export const overviewCardTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  color: Colors.primaryDark,
})

export const overviewCardDesc = css({
  fontSize: FontSize.xs,
  color: Colors.textSub,
  lineHeight: 1.5,
})

export const tailoringList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  marginTop: Spacing.xs,
})

export const tailoringItem = css({
  backgroundColor: Colors.surfaceHighlight,
  border: `1px solid ${Colors.borderPurple}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
  fontSize: FontSize.sm,
  color: Colors.textMain,
  fontFamily: FontFamily.body,
  lineHeight: 1.5,
})

export const interactionArea = css({
  width: '100%',
  maxWidth: '72rem',
  padding: `0 ${Spacing.md} ${Spacing.xl}`,
  animation: `${fadeSlideIn} 0.35s ease both`,
})

export const genderButtons = css({
  display: 'flex',
  gap: Spacing.sm,
  flexWrap: 'wrap',
})

export const genderBtn = (active: boolean) =>
  css({
    padding: `${Spacing.sm} ${Spacing.lg}`,
    border: `2px solid ${active ? Colors.primary : Colors.border}`,
    backgroundColor: active ? Colors.primaryLight : Colors.white,
    color: active ? Colors.primaryDark : Colors.textMain,
    fontFamily: FontFamily.body,
    fontWeight: FontWeight.medium,
    fontSize: FontSize.base,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': { borderColor: Colors.primary },
  })

export const otherInput = css({
  marginTop: Spacing.sm,
  display: 'flex',
  gap: Spacing.sm,
})

export const rolesRow = css({
  display: 'flex',
  gap: Spacing.sm,
  marginBottom: Spacing.sm,
})

export const roleTagsArea = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: Spacing.xs,
  marginBottom: Spacing.sm,
  minHeight: '3.2rem',
})

export const submitBtn = css({
  marginTop: Spacing.sm,
})

export const employedButtons = css({
  display: 'flex',
  gap: Spacing.sm,
})

export const hintText = css({
  fontSize: FontSize.xs,
  color: Colors.textPlaceholder,
  marginBottom: Spacing.sm,
  fontFamily: FontFamily.body,
})

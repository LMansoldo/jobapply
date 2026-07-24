import { css, keyframes } from '@emotion/css'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

const typingDot = keyframes`
  0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-0.4rem); }
`

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(0.8rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const sheetUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const root = css({
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
  minHeight: '100dvh',
  backgroundColor: '#f5f3ff',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  fontFamily: FontFamily.body,
  boxShadow: '0 0 60px rgba(91,33,182,0.12)',
})

export const header = css({
  position: 'sticky',
  top: 0,
  zIndex: 20,
  background: 'rgba(245,243,255,0.92)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  borderBottom: '1px solid #e9e4fc',
  flexShrink: 0,
})

export const headerLogo = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const headerLogoText = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.extrabold,
  fontSize: '1.6rem',
  color: '#1e1b2e',
})

export const headerLogoDot = css({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: '#a78bfa',
})

export const headerStepGroup = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const headerDots = css({
  display: 'flex',
  gap: '4px',
})

export const headerDot = (active: boolean) => css({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: active ? '#7c3aed' : '#ddd6fe',
})

export const headerBadge = css({
  fontSize: '1.1rem',
  fontWeight: FontWeight.semibold,
  color: '#6d28d9',
  background: '#ede9fe',
  padding: '4px 10px',
  borderRadius: '9999px',
  letterSpacing: '0.2px',
})

export const chatArea = css({
  flex: 1,
  overflowY: 'auto',
  padding: '20px 16px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const botRow = css({
  display: 'flex',
  animation: `${fadeSlideIn} 0.3s ease both`,
})

export const botBubble = css({
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  color: '#1e1b2e',
  padding: '11px 16px',
  borderRadius: '18px 18px 18px 4px',
  maxWidth: '88%',
  fontSize: '1.45rem',
  fontFamily: FontFamily.body,
  lineHeight: 1.55,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
})

export const botBubbleWarning = css({
  backgroundColor: '#fef3c7',
  border: '1px solid #fde68a',
  color: '#92400e',
  padding: '11px 16px 11px 12px',
  borderRadius: '18px 18px 18px 4px',
  maxWidth: '88%',
  fontSize: '1.45rem',
  fontFamily: FontFamily.body,
  lineHeight: 1.55,
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-start',
})

export const userRow = css({
  display: 'flex',
  justifyContent: 'flex-end',
  animation: `${fadeSlideIn} 0.3s ease both`,
})

export const userBubble = css({
  background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
  color: '#ffffff',
  padding: '11px 16px',
  borderRadius: '18px 18px 4px 18px',
  maxWidth: '82%',
  fontSize: '1.45rem',
  fontFamily: FontFamily.body,
  lineHeight: 1.5,
  fontWeight: FontWeight.medium,
})

export const typingRow = css({
  display: 'flex',
})

export const typingBubble = css({
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '13px 18px',
  borderRadius: '18px 18px 18px 4px',
  display: 'flex',
  gap: '5px',
  alignItems: 'center',
})

export const typingDotEl = (delay: number) =>
  css({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#c4b5fd',
    animation: `${typingDot} 1.2s ease infinite`,
    animationDelay: `${delay}s`,
  })

export const overviewCards = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const overviewCard = css({
  backgroundColor: '#f5f0ff',
  border: '1px solid #d3b8ff',
  borderRadius: '14px',
  padding: '14px 16px',
})

export const overviewCardTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: '1.4rem',
  color: '#6d28d9',
  marginBottom: '3px',
})

export const overviewCardDesc = css({
  fontSize: '1.25rem',
  color: '#6b7280',
  lineHeight: 1.5,
})

export const tailoringList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const tailoringItem = css({
  backgroundColor: '#f5f0ff',
  border: '1px solid #d3b8ff',
  borderRadius: '14px',
  padding: '12px 16px',
  fontSize: '1.35rem',
  color: '#1e1b2e',
  fontFamily: FontFamily.body,
  lineHeight: 1.5,
})

export const interactionArea = css({
  position: 'sticky',
  bottom: 0,
  background: '#ffffff',
  borderTop: '1px solid #e9e4fc',
  borderRadius: '20px 20px 0 0',
  padding: '18px 16px calc(18px + env(safe-area-inset-bottom))',
  boxShadow: '0 -8px 24px rgba(91,33,182,0.10)',
  animation: `${sheetUp} 0.3s ease both`,
  flexShrink: 0,
})

export const sheetTitle = css({
  fontSize: '1.5rem',
  fontWeight: FontWeight.bold,
  color: '#1e1b2e',
  marginBottom: '12px',
  fontFamily: FontFamily.heading,
})

export const sheetSubtitle = css({
  fontSize: '1.2rem',
  color: '#888888',
  marginBottom: '12px',
})

export const sheetSubmitBtn = (enabled: boolean) => css({
  width: '100%',
  height: '48px',
  borderRadius: '12px',
  border: 'none',
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.bold,
  fontSize: '1.45rem',
  cursor: enabled ? 'pointer' : 'not-allowed',
  background: enabled ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#e9e4fc',
  color: enabled ? '#ffffff' : '#a0aec0',
  boxShadow: enabled ? '0 2px 12px rgba(124,58,237,0.30)' : 'none',
  display: 'block',
})

export const genderButtons = css({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginBottom: '12px',
})

export const genderBtn = (active: boolean) =>
  css({
    padding: '10px 18px',
    height: '44px',
    borderRadius: '9999px',
    border: `1.5px solid ${active ? '#7c3aed' : '#e9e4fc'}`,
    background: active ? '#ede9fe' : '#ffffff',
    color: active ? '#6d28d9' : '#1e1b2e',
    fontFamily: FontFamily.body,
    fontWeight: FontWeight.semibold,
    fontSize: '1.4rem',
    cursor: 'pointer',
  })

export const genderOtherInput = css({
  width: '100%',
  height: '48px',
  borderRadius: '12px',
  border: '1px solid #e9e4fc',
  background: '#f5f3ff',
  padding: '0 14px',
  fontSize: '1.45rem',
  fontFamily: FontFamily.body,
  marginBottom: '12px',
  outline: 'none',
  color: '#1e1b2e',
  boxSizing: 'border-box',
  display: 'block',
})

export const rolesRow = css({
  display: 'flex', gap: '8px', marginBottom: '10px',
})

export const roleTextInput = css({
  flex: 1, height: '48px', borderRadius: '12px',
  border: '1px solid #e9e4fc', background: '#f5f3ff',
  padding: '0 14px', fontSize: '1.45rem', fontFamily: FontFamily.body,
  outline: 'none', color: '#1e1b2e', minWidth: 0, boxSizing: 'border-box',
})

export const addRoleBtn = (enabled: boolean) => css({
  width: '48px', height: '48px', flexShrink: 0, borderRadius: '12px',
  border: 'none', fontSize: '2.0rem', fontWeight: FontWeight.semibold,
  background: enabled ? '#ede9fe' : '#f5f3ff', color: '#6d28d9',
  cursor: enabled ? 'pointer' : 'not-allowed',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
})

export const roleTagsArea = css({
  display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px',
})

export const roleTag = css({
  display: 'flex', alignItems: 'center', gap: '6px',
  background: '#ede9fe', color: '#6d28d9', fontSize: '1.3rem',
  fontWeight: FontWeight.semibold, padding: '6px 8px 6px 12px',
  borderRadius: '9999px',
})

export const roleTagRemoveBtn = css({
  width: '16px', height: '16px', borderRadius: '50%', border: 'none',
  background: 'rgba(124,58,237,0.15)', color: '#6d28d9', fontSize: '1.1rem',
  lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', padding: 0, flexShrink: 0,
})

export const employedButtons = css({
  display: 'flex', flexDirection: 'column', gap: '10px',
})

export const employedPrimaryBtn = css({
  height: '48px', borderRadius: '12px', border: 'none',
  background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#ffffff',
  fontFamily: FontFamily.body, fontWeight: FontWeight.bold,
  fontSize: '1.45rem', cursor: 'pointer',
  boxShadow: '0 2px 12px rgba(124,58,237,0.30)',
})

export const employedOutlineBtn = css({
  height: '48px', borderRadius: '12px', border: '1.5px solid #7c3aed',
  background: 'transparent', color: '#6d28d9',
  fontFamily: FontFamily.body, fontWeight: FontWeight.bold,
  fontSize: '1.45rem', cursor: 'pointer',
})

export const isDoneRow = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '16px 0',
  color: '#7c3aed',
  fontSize: '1.3rem',
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
})

export const isDoneSpinner = css({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '2px solid #ddd6fe',
  borderTopColor: '#7c3aed',
  animation: `${spin} 0.7s linear infinite`,
  flexShrink: 0,
  display: 'inline-block',
})

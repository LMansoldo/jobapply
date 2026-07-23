import { css, keyframes } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'
import { mediaQueries } from '../../../styles/theme/breakpoints'

const floatOrb = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const bounce = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
`

export const pageRoot = css({
  fontFamily: FontFamily.body,
  background: Colors.pageBg,
  color: Colors.textMain,
  minHeight: '100vh',
  overflowX: 'hidden',
  '& html': { scrollBehavior: 'smooth' },
})

/* ── NAV ──────────────────────────────── */
export const nav = (scrolled: boolean) => css({
  position: 'fixed',
  top: 0, left: 0, right: 0,
  zIndex: 200,
  padding: '0 4.8rem',
  height: '6.8rem',
  display: 'flex',
  alignItems: 'center',
  transition: 'background 0.3s, box-shadow 0.3s',
  background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
  backdropFilter: scrolled ? 'blur(16px)' : 'none',
  boxShadow: scrolled ? `0 1px 0 ${Colors.surfaceBorder}` : 'none',
  [mediaQueries.tabletDown]: { padding: '0 2rem' },
})

export const navLogo = (scrolled: boolean) => css({
  fontFamily: FontFamily.heading,
  fontSize: '2.4rem',
  fontWeight: FontWeight.extrabold,
  letterSpacing: '-0.5px',
  textDecoration: 'none',
  cursor: 'pointer',
  color: scrolled ? Colors.primaryDark : '#fff',
})

export const navLogoAccent = (scrolled: boolean) => css({
  color: scrolled ? Colors.primaryMid : Colors.primaryMid,
})

export const navLinks = (scrolled: boolean) => css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginLeft: '4.0rem',
  [mediaQueries.tabletDown]: { display: 'none' },
  '& a': {
    fontSize: '1.4rem',
    fontWeight: FontWeight.semibold,
    color: scrolled ? Colors.textSub : 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '99px',
    transition: 'all 0.2s',
    '&:hover': {
      color: scrolled ? Colors.primaryDark : '#fff',
      background: scrolled ? Colors.primaryLight : 'rgba(255,255,255,0.12)',
    },
  },
})

export const navCtas = css({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '1.0rem',
})

export const navBtnGhost = (scrolled: boolean) => css({
  background: scrolled ? 'transparent' : 'rgba(255,255,255,0.15)',
  border: `1.5px solid ${scrolled ? Colors.primary : 'rgba(255,255,255,0.3)'}`,
  color: scrolled ? Colors.primaryDark : '#fff',
  borderRadius: '99px',
  padding: '0.8rem 2.0rem',
  fontFamily: FontFamily.body,
  fontSize: '1.4rem',
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'all 0.2s',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  '&:hover': {
    background: scrolled ? Colors.primaryLight : 'rgba(255,255,255,0.25)',
  },
})

export const navBtnSolid = (scrolled: boolean) => css({
  background: scrolled ? Colors.primary : '#fff',
  color: scrolled ? '#fff' : Colors.primaryDark,
  border: 'none',
  borderRadius: '99px',
  padding: '0.8rem 2.2rem',
  fontFamily: FontFamily.body,
  fontSize: '1.4rem',
  fontWeight: FontWeight.bold,
  cursor: 'pointer',
  transition: 'all 0.2s',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    background: scrolled ? Colors.primaryDark : Colors.primaryLight,
    transform: 'translateY(-1px)',
  },
})

/* ── HERO ─────────────────────────────── */
export const hero = css({
  minHeight: '100vh',
  background: Colors.gradientHeroDark,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
})

export const orb1 = css({
  position: 'absolute',
  width: '60rem',
  height: '60rem',
  background: `radial-gradient(circle, ${Colors.accent} 0%, transparent 70%)`,
  top: '-10rem',
  right: '-10rem',
  borderRadius: '50%',
  filter: 'blur(80px)',
  opacity: 0.45,
  pointerEvents: 'none',
  animation: `${floatOrb} 12s ease-in-out infinite`,
})

export const orb2 = css({
  position: 'absolute',
  width: '40rem',
  height: '40rem',
  background: `radial-gradient(circle, ${Colors.blue} 0%, transparent 70%)`,
  bottom: '5rem',
  left: '-8rem',
  borderRadius: '50%',
  filter: 'blur(80px)',
  opacity: 0.45,
  pointerEvents: 'none',
  animation: `${floatOrb} 9s ease-in-out infinite reverse`,
})

export const orb3 = css({
  position: 'absolute',
  width: '30rem',
  height: '30rem',
  background: `radial-gradient(circle, ${Colors.primaryMid} 0%, transparent 70%)`,
  top: '40%',
  right: '20%',
  borderRadius: '50%',
  filter: 'blur(80px)',
  opacity: 0.3,
  pointerEvents: 'none',
  animation: `${floatOrb} 14s ease-in-out infinite 2s`,
})

export const heroContent = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '12rem 2.4rem 8rem',
  position: 'relative',
  zIndex: 2,
})

export const heroEyebrow = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.8rem',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '99px',
  padding: '0.6rem 1.6rem',
  fontSize: '1.3rem',
  fontWeight: FontWeight.semibold,
  color: Colors.primaryMid,
  marginBottom: '2.8rem',
  animation: `${fadeUp} 0.6s ease both`,
})

export const liveDot = css({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: Colors.green,
  animation: `${pulse} 2s infinite`,
})

export const heroH1 = css({
  fontFamily: FontFamily.heading,
  fontSize: 'clamp(4.2rem, 7vw, 8.0rem)',
  fontWeight: FontWeight.extrabold,
  lineHeight: 1.05,
  color: '#fff',
  letterSpacing: '-2px',
  marginBottom: '2.4rem',
  animation: `${fadeUp} 0.6s ease 0.1s both`,
})

export const heroH1Grad = css({
  background: Colors.gradientBrandText,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
})

export const heroSub = css({
  fontSize: 'clamp(1.6rem, 2vw, 2.0rem)',
  color: 'rgba(255,255,255,0.65)',
  lineHeight: 1.6,
  maxWidth: '58rem',
  margin: '0 auto 4.0rem',
  animation: `${fadeUp} 0.6s ease 0.2s both`,
})

export const heroCtas = (isMobile: boolean) => css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.4rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
  animation: `${fadeUp} 0.6s ease 0.3s both`,
  marginBottom: '6.0rem',
  flexDirection: isMobile ? 'column' : 'row',
})

export const ctaMain = css({
  background: '#fff',
  color: Colors.primaryDark,
  border: 'none',
  borderRadius: '99px',
  padding: '1.4rem 3.2rem',
  fontFamily: FontFamily.heading,
  fontSize: '1.5rem',
  fontWeight: FontWeight.bold,
  cursor: 'pointer',
  transition: 'all 0.25s',
  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.9rem',
  textDecoration: 'none',
  '&:hover': {
    background: Colors.primaryLight,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  },
})

export const ctaSec = css({
  background: 'rgba(255,255,255,0.1)',
  border: '1.5px solid rgba(255,255,255,0.25)',
  color: '#fff',
  borderRadius: '99px',
  padding: '1.3rem 2.8rem',
  fontFamily: FontFamily.heading,
  fontSize: '1.5rem',
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.8rem',
  textDecoration: 'none',
  '&:hover': { background: 'rgba(255,255,255,0.18)' },
})

export const scrollHint = css({
  position: 'absolute',
  bottom: '3.2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'rgba(255,255,255,0.35)',
  fontSize: '2.0rem',
  animation: `${bounce} 2s infinite`,
  cursor: 'pointer',
  zIndex: 2,
  background: 'none',
  border: 'none',
})

/* ── SECTIONS ─────────────────────────── */
export const section = css({
  padding: '10rem 4.8rem',
  maxWidth: '128rem',
  margin: '0 auto',
  [mediaQueries.tabletDown]: { padding: '6.4rem 2.0rem' },
})

export const sectionLabel = css({
  fontSize: '1.2rem',
  fontWeight: FontWeight.bold,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: Colors.primary,
  marginBottom: '1.2rem',
})

export const sectionTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: 'clamp(2.8rem, 4vw, 4.4rem)',
  fontWeight: FontWeight.extrabold,
  color: Colors.textMain,
  lineHeight: 1.15,
  letterSpacing: '-1px',
  marginBottom: '1.6rem',
})

export const sectionSub = css({
  fontSize: '1.7rem',
  color: Colors.textSub,
  lineHeight: 1.65,
  maxWidth: '54rem',
})

/* ── FEATURES ─────────────────────────── */
export const featuresGrid = (isMobile: boolean) => css({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
  gap: '2.0rem',
  marginTop: '5.6rem',
})

export const featCard = css({
  background: Colors.white,
  borderRadius: '1.6rem',
  border: `1px solid ${Colors.surfaceBorder}`,
  padding: '2.8rem 2.6rem',
  boxShadow: '0 2px 20px rgba(124,58,237,0.09)',
  transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
  cursor: 'default',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 8px 40px rgba(124,58,237,0.16)',
    borderColor: Colors.primaryMid,
  },
})

export const featIcon = (bg: string) => css({
  width: '5.2rem',
  height: '5.2rem',
  borderRadius: '1.4rem',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.2rem',
  marginBottom: '1.8rem',
})

export const featTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: '1.7rem',
  fontWeight: FontWeight.bold,
  marginBottom: '0.8rem',
  color: Colors.textMain,
})

export const featDesc = css({
  fontSize: '1.4rem',
  color: Colors.textSub,
  lineHeight: 1.65,
})

export const featTag = css({
  display: 'inline-block',
  marginTop: '1.4rem',
  background: Colors.primaryLight,
  color: Colors.primaryDark,
  borderRadius: '99px',
  padding: '0.3rem 1.2rem',
  fontSize: '1.15rem',
  fontWeight: FontWeight.bold,
})

/* ── HOW IT WORKS ─────────────────────── */
export const hiwBg = css({
  background: 'linear-gradient(180deg, #fff 0%, #f5f3ff 100%)',
})

export const hiwGrid = (isMobile: boolean) => css({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: '8.0rem',
  alignItems: 'center',
  marginTop: '5.6rem',
  [mediaQueries.tabletDown]: { gridTemplateColumns: '1fr', gap: '4.0rem' },
})

export const stepRow = css({
  display: 'flex',
  gap: '2.0rem',
  padding: '2.2rem 0',
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  cursor: 'default',
  transition: 'all 0.2s',
  '&:last-child': { borderBottom: 'none' },
  '&:hover .step-num-inner': {
    background: Colors.primary,
    color: '#fff',
  },
})

export const stepNum = css({
  width: '4.0rem',
  height: '4.0rem',
  borderRadius: '1.2rem',
  background: Colors.primaryLight,
  color: Colors.primaryDark,
  fontFamily: FontFamily.heading,
  fontSize: '1.6rem',
  fontWeight: FontWeight.extrabold,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.2s',
})

export const stepTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: '1.6rem',
  fontWeight: FontWeight.bold,
  marginBottom: '0.4rem',
})

export const stepDesc = css({
  fontSize: '1.4rem',
  color: Colors.textSub,
  lineHeight: 1.6,
})

export const hiwVisual = css({
  background: Colors.white,
  borderRadius: '1.6rem',
  border: `1px solid ${Colors.surfaceBorder}`,
  boxShadow: '0 20px 60px rgba(124,58,237,0.22)',
  overflow: 'hidden',
})

export const hiwVisualBar = css({
  background: '#f8f7fc',
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: '1.2rem 1.6rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
})

export const dot = (color: string) => css({
  width: '1.0rem',
  height: '1.0rem',
  borderRadius: '50%',
  background: color,
})

export const hiwVisualBody = css({ padding: '2.4rem' })

export const miniAts = css({ display: 'flex', flexDirection: 'column', gap: '1.2rem' })

export const miniAtsTitle = css({
  fontFamily: FontFamily.heading,
  fontSize: '1.3rem',
  fontWeight: FontWeight.bold,
  color: Colors.primaryDark,
})

export const miniKwRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.0rem',
  fontSize: '1.2rem',
})

export const miniKwLabel = css({
  width: '11rem',
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
})

export const miniKwBar = css({
  flex: 1,
  height: '0.8rem',
  background: Colors.primaryLight,
  borderRadius: '99px',
  overflow: 'hidden',
})

export const miniKwFill = (width: string, color: string) => css({
  height: '100%',
  borderRadius: '99px',
  background: color,
  width,
})

export const miniKwPct = css({
  width: '3.6rem',
  textAlign: 'right',
  fontWeight: FontWeight.bold,
  fontSize: '1.15rem',
})

export const miniScoreBadge = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.8rem',
  background: Colors.successBg,
  color: '#065f46',
  borderRadius: '99px',
  padding: '0.5rem 1.4rem',
  fontSize: '1.2rem',
  fontWeight: FontWeight.bold,
  marginTop: '0.4rem',
})

/* ── CTA BAND ────────────────────────── */
export const ctaBand = css({
  background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 50%, #7c3aed 100%)',
  padding: '8.0rem 4.8rem',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  [mediaQueries.tabletDown]: { padding: '6rem 2.0rem' },
})

export const ctaBandH2 = css({
  fontFamily: FontFamily.heading,
  fontSize: 'clamp(2.8rem, 4vw, 4.4rem)',
  fontWeight: FontWeight.extrabold,
  color: '#fff',
  marginBottom: '1.6rem',
  position: 'relative',
})

export const ctaBandP = css({
  fontSize: '1.7rem',
  color: 'rgba(255,255,255,0.65)',
  marginBottom: '3.6rem',
  position: 'relative',
})

/* ── FOOTER ──────────────────────────── */
export const footer = css({
  background: Colors.textMain,
  padding: '4.8rem 4.8rem 3.2rem',
  [mediaQueries.tabletDown]: { padding: '4rem 2rem 2.4rem' },
})

export const footerInner = css({
  maxWidth: '128rem',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '2.0rem',
})

export const footerLogo = css({
  fontFamily: FontFamily.heading,
  fontSize: '2.2rem',
  fontWeight: FontWeight.extrabold,
  color: '#fff',
})

export const footerLogoAccent = css({ color: Colors.primaryMid })

export const footerLinks = css({
  display: 'flex',
  gap: '2.4rem',
  '& a': {
    fontSize: '1.35rem',
    color: 'rgba(255,255,255,0.45)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s',
    '&:hover': { color: Colors.primaryMid },
  },
})

export const footerCopy = css({
  width: '100%',
  textAlign: 'center',
  fontSize: '1.25rem',
  color: 'rgba(255,255,255,0.25)',
  marginTop: '2.4rem',
  paddingTop: '2.4rem',
  borderTop: '1px solid rgba(255,255,255,0.08)',
})

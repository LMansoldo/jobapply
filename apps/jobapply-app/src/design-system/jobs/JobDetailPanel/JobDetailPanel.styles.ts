import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily, LetterSpacing } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'

const TITLE_LETTER_SPACING = '-0.8px'
const DOT_SIZE = '0.3rem'

export const panel = css({
  background: Colors.white,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

// ── Header ────────────────────────────────────────────────────────────────────

export const header = css({
  padding: `${Spacing.lg} ${Spacing.xl}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: Spacing.md,
})

export const headerLeft = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
})

export const companyLogoWrap = css({
  borderRadius: BorderRadius.base,
  border: `1px solid ${Colors.borderLight}`,
  boxShadow: Shadows.sm,
  overflow: 'hidden',
  flexShrink: 0,
})

export const companyInfo = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const companyName = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
  margin: 0,
  letterSpacing: LetterSpacing.tight,
})

export const companyUrl = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '18rem',
})

export const headerActions = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  flexShrink: 0,
})

export const iconBtn = css({
  background: Colors.white,
  border: `1px solid ${Colors.borderLight}`,
  borderRadius: BorderRadius.sm,
  cursor: 'pointer',
  color: Colors.textSub,
  fontSize: FontSize.sm,
  padding: `${Spacing.xs} ${Spacing.sm}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    background: Colors.surfacePage,
    color: Colors.textMain,
  },
})

// ── Body ─────────────────────────────────────────────────────────────────────

export const body = css({
  padding: `${Spacing.lg} ${Spacing.xl}`,
})

export const jobTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: FontSize.xxl,
  color: Colors.textMain,
  letterSpacing: TITLE_LETTER_SPACING,
  margin: `0 0 ${Spacing.sm}`,
  lineHeight: 1.2,
})

// ── Meta ──────────────────────────────────────────────────────────────────────

export const jobMeta = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
  margin: `0 0 ${Spacing.md}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: Spacing.sm,
  alignItems: 'center',
})

export const metaChip = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: Colors.textSub,
})

export const metaIcon = css({
  opacity: 0.6,
  fontSize: FontSize.sm,
  flexShrink: 0,
})

export const metaChipCount = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: Colors.primary,
  fontWeight: FontWeight.medium,
})

export const metaDot = css({
  display: 'inline-block',
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '50%',
  background: Colors.borderLight,
  flexShrink: 0,
  alignSelf: 'center',
})

// ── Tags ─────────────────────────────────────────────────────────────────────

export const tagRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: Spacing.sm,
  marginBottom: Spacing.lg,
})

export const tagPill = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.primary,
  border: `1px solid ${Colors.primaryMid}`,
  borderRadius: BorderRadius.full,
  padding: `${Spacing.xs} ${Spacing.md1}`,
  background: Colors.primaryLight,
  letterSpacing: LetterSpacing.wide,
})

export const tagPillCheck = css({
  color: Colors.success,
  fontSize: FontSize.xs,
})

// ── Salary ───────────────────────────────────────────────────────────────────

export const salary = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  background: Colors.primaryLight,
  borderRadius: BorderRadius.sm,
  padding: `${Spacing.xxs} ${Spacing.md}`,
  marginBottom: Spacing.md,
})

// ── CTA row ──────────────────────────────────────────────────────────────────

export const actionsRow = css({
  display: 'flex',
  gap: Spacing.sm,
  marginBottom: Spacing.md,
  flexWrap: 'wrap',
})

export const applyBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.6rem',
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.md} ${Spacing.xl}`,
  fontSize: FontSize.md0,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  letterSpacing: LetterSpacing.wide,
  transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
  '&:hover': {
    background: Colors.primaryDeeper,
    transform: 'translateY(-0.1rem)',
    boxShadow: `0 0.4rem 1.4rem rgba(91,61,232,0.35)`,
  },
  '&:active': { transform: 'scale(0.97)' },
})

export const saveBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.6rem',
  background: Colors.white,
  color: Colors.primaryDark,
  border: `1.5px solid ${Colors.primaryMid}`,
  borderRadius: BorderRadius.base,
  padding: `${Spacing.md} ${Spacing.lg}`,
  fontSize: FontSize.md0,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'background 0.15s',
  '&:hover': { background: Colors.primaryLight },
})

// ── Tailor button ─────────────────────────────────────────────────────────────

export const tailorBtn = css({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.sm,
  background: `linear-gradient(135deg, ${Colors.primaryDeeper} 0%, ${Colors.primaryDark} 50%, ${Colors.primary} 100%)`,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.md} ${Spacing.xl}`,
  fontSize: FontSize.md,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  marginBottom: Spacing.lg,
  letterSpacing: LetterSpacing.wide,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `0 0.4rem 2rem rgba(91,61,232,0.4)`,
  transition: 'opacity 0.15s, transform 0.1s, box-shadow 0.15s',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12), transparent)',
    pointerEvents: 'none',
  },
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-0.1rem)',
    boxShadow: `0 0.6rem 2.4rem rgba(91,61,232,0.5)`,
  },
  '&:active': { transform: 'scale(0.98)' },
})

// ── Divider ───────────────────────────────────────────────────────────────────

export const divider = css({
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  margin: `0 0 ${Spacing.lg}`,
})

export const dividerWithTopMargin = css({
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  margin: `${Spacing.xl} 0 ${Spacing.lg}`,
})

// ── About section ─────────────────────────────────────────────────────────────

export const sectionTitle = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.bold,
  letterSpacing: LetterSpacing.eyebrow,
  textTransform: 'uppercase',
  color: Colors.textSub,
  margin: `0 0 ${Spacing.md}`,
})

export const descriptionText = css({
  fontSize: FontSize.md,
  color: Colors.textBody,
  lineHeight: 1.75,
  whiteSpace: 'pre-wrap',
  margin: 0,
})

// ── Empty state ────────────────────────────────────────────────────────────────

export const hotBadgeInline = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  fontSize: FontSize.xxs,
  fontWeight: FontWeight.semibold,
  color: Colors.orange,
  background: Colors.orangeBg,
  borderRadius: '8px',
  padding: `2px 8px`,
})

export const emptyPanel = css({
  background: Colors.white,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: Spacing.xxl,
  textAlign: 'center',
  color: Colors.textSub,
  gap: Spacing.md,
  minHeight: '32rem',
  flex: 1,
})

export const emptyIcon = css({
  fontSize: '4rem',
})

export const emptyText = css({
  fontSize: FontSize.base,
  fontWeight: FontWeight.medium,
  color: Colors.textSub,
  margin: 0,
})

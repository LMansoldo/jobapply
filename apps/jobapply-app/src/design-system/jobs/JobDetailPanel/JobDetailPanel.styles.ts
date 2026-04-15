import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'

export const panel = css({
  background: Colors.white,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

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

export const companyName = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  color: Colors.textSub,
  margin: 0,
})

export const headerActions = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  flexShrink: 0,
})

export const iconBtn = css({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: Colors.textSub,
  fontSize: '1.8rem',
  padding: '4px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s, color 0.15s',
  ':hover': {
    background: Colors.surfacePage,
    color: Colors.textMain,
  },
})

export const body = css({
  padding: `${Spacing.lg} ${Spacing.xl}`,
})

export const jobTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  fontSize: '2.2rem',
  color: Colors.textMain,
  margin: `0 0 ${Spacing.sm}`,
  lineHeight: 1.25,
})

export const jobMeta = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
  margin: `0 0 ${Spacing.md}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  alignItems: 'center',
})

export const metaDot = css({
  color: Colors.surfaceBorder,
})

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
  color: Colors.textSub,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: '20px',
  padding: `4px ${Spacing.md}`,
  background: Colors.white,
})

export const tagPillCheck = css({
  color: Colors.success,
  fontSize: '1.2rem',
})

export const actionsRow = css({
  display: 'flex',
  gap: Spacing.sm,
  marginBottom: Spacing.md,
  flexWrap: 'wrap',
})

export const applyBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: '20px',
  padding: `${Spacing.sm} ${Spacing.lg}`,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  ':hover': { opacity: 0.88 },
})

export const saveBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: Colors.white,
  color: Colors.primaryDark,
  border: `1.5px solid ${Colors.primaryDark}`,
  borderRadius: '20px',
  padding: `${Spacing.sm} ${Spacing.lg}`,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: Colors.primaryLight },
})

export const tailorBtn = css({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.sm,
  background: Colors.gradientTailorBtn,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.base,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  cursor: 'pointer',
  marginBottom: Spacing.lg,
  transition: 'opacity 0.15s',
  ':hover': { opacity: 0.9 },
})

export const divider = css({
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  margin: `0 0 ${Spacing.lg}`,
})

export const dividerWithTopMargin = css({
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  margin: `${Spacing.xl} 0 ${Spacing.lg}`,
})

export const sectionTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.lg,
  color: Colors.textMain,
  margin: `0 0 ${Spacing.md}`,
})

export const descriptionText = css({
  fontSize: FontSize.sm,
  color: Colors.textMain,
  lineHeight: 1.75,
  whiteSpace: 'pre-wrap',
  margin: 0,
})

export const salary = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  background: Colors.primaryLight,
  borderRadius: '8px',
  padding: `3px ${Spacing.md}`,
  marginBottom: Spacing.md,
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

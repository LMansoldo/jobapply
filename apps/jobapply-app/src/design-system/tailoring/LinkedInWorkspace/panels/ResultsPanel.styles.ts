import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily, LineHeight } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { mediaQueries } from '../../../../styles/theme/breakpoints'

const SIDE_WIDTH = '30rem'

export const grid = css({
  display: 'grid',
  gridTemplateColumns: `1fr ${SIDE_WIDTH}`,
  minHeight: '40rem',
  [mediaQueries.tabletDown]: { gridTemplateColumns: '1fr' },
})

export const mainPane = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  padding: Spacing.lg,
  overflowY: 'auto',
})

export const sidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.lg,
  background: Colors.surfacePage,
  overflowY: 'auto',
  [mediaQueries.tabletDown]: {
    borderLeft: 'none',
    borderTop: `1px solid ${Colors.surfaceBorder}`,
  },
})

export const topRow = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const linkedinBadge = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: Spacing.xs,
  padding: `${Spacing.xs} ${Spacing.sm}`,
  background: Colors.socialLinkedin,
  color: Colors.white,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  letterSpacing: '0.04em',
})

export const scoreChip = css({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.4rem',
  padding: `${Spacing.xs} ${Spacing.md}`,
  background: Colors.primaryLight,
  border: `1px solid ${Colors.primaryMid}`,
})

export const scoreNumber = css({
  fontSize: FontSize.h3,
  fontWeight: FontWeight.extrabold,
  fontFamily: FontFamily.heading,
  color: Colors.primaryDark,
  lineHeight: 1,
})

export const scoreDivider = css({
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
})

export const priorityBanner = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
  padding: Spacing.md,
  background: Colors.warningBg,
  border: `1px solid ${Colors.warning}`,
})

export const priorityLabel = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.bold,
  fontFamily: FontFamily.body,
  color: Colors.warning,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const priorityText = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
})

export const sectionCard = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  padding: Spacing.lg,
  background: Colors.white,
  border: `1px solid ${Colors.surfaceBorder}`,
})

export const sectionHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const sectionLabel = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.primaryDark,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const subLabel = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

// Score badge variants
export const danger = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.danger,
  background: Colors.dangerBg,
  padding: `0.2rem ${Spacing.sm}`,
  textTransform: 'capitalize',
})

export const warning = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.warning,
  background: Colors.warningBg,
  padding: `0.2rem ${Spacing.sm}`,
  textTransform: 'capitalize',
})

export const success = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.success,
  background: Colors.successBg,
  padding: `0.2rem ${Spacing.sm}`,
  textTransform: 'capitalize',
})

export const alternativesList = css({
  margin: 0,
  paddingLeft: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const alternativeItem = css({
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
})

export const issuesList = css({
  margin: 0,
  paddingLeft: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
})

export const issueItem = css({
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
})

export const rewriteText = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.spacious,
  whiteSpace: 'pre-wrap',
  padding: Spacing.md,
  background: Colors.successBg,
  border: `1px solid ${Colors.success}`,
})

export const gapBlock = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  paddingTop: Spacing.md,
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  '&:first-child': { borderTop: 'none', paddingTop: 0 },
})

export const gapRole = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
})

export const diffRow = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: Spacing.sm,
})

export const diffPane = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
  padding: Spacing.sm,
  background: Colors.surfacePage,
  border: `1px solid ${Colors.surfaceBorder}`,
})

export const diffLabel = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.bold,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

export const diffText = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
})

export const scoreBreakdown = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const bulletList = css({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
})

export const bulletGreen = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
  paddingLeft: Spacing.md,
  position: 'relative',
  '&::before': { content: '"✓"', position: 'absolute', left: 0, color: Colors.success, fontWeight: FontWeight.bold },
})

export const bulletRed = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
  paddingLeft: Spacing.md,
  position: 'relative',
  '&::before': { content: '"✗"', position: 'absolute', left: 0, color: Colors.danger, fontWeight: FontWeight.bold },
})

export const keywordSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const keywordGroup = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
})

export const keywordGroupLabel = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
})

export const tagRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: Spacing.xs,
})

export const tag = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.primaryDark,
  background: Colors.primaryLight,
  border: `1px solid ${Colors.primaryMid}`,
  padding: `0.2rem ${Spacing.sm}`,
})

export const quickWinsSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const quickWinsList = css({
  margin: 0,
  paddingLeft: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const quickWinItem = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
})

export const voiceProfileSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
  padding: Spacing.md,
  background: Colors.primaryLight,
  border: `1px solid ${Colors.primaryMid}`,
})

export const voiceSubLabel = css({
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  fontFamily: FontFamily.body,
  color: Colors.primaryDark,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

export const qualityNote = css({
  margin: 0,
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textMain,
  lineHeight: LineHeight.relaxed,
  fontStyle: 'italic',
})

export const newAnalysisBtn = css({
  width: '100%',
  padding: `${Spacing.sm} 0`,
  background: Colors.socialLinkedin,
  color: Colors.white,
  border: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  marginTop: 'auto',
  '&:hover': { opacity: 0.88 },
})

import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { mediaQueries } from '../../../styles/theme/breakpoints'
import SizeContext from 'antd/es/config-provider/SizeContext'

export const contextBar = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  flexShrink: 0,
  flexWrap: 'wrap',
  [mediaQueries.mobileOnly]: {
    padding: `${Spacing.xs} ${Spacing.md}`,
  },
})

export const backBtn = css({
  background: 'none',
  border: 'none',
  color: Colors.primaryDark,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  minHeight: Spacing.headerHeight,
  fontFamily: FontFamily.body,
  [mediaQueries.mobileOnly]: {
    flexBasis: '100%',
  },
})

export const contextDivider = css({
  display: 'inline-block',
  width: '1px',
  height: '2rem',
  background: Colors.surfaceBorder,
})

export const jobRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  minWidth: 0,
  [mediaQueries.mobileOnly]: {
    flexBasis: '100%',
    justifyContent: 'space-between',
  },
})

export const analysisStatus = css({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
})

export const scoreBadgeWrapper = css({
  display: 'none',
  [mediaQueries.mobileOnly]: {
    display: 'flex',
    alignItems: 'center',
  },
})

export const analysisDot = css({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: Colors.success,
  flexShrink: 0,
})

export const analysisDotRunning = css({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: Colors.orange,
  flexShrink: 0,
  animation: 'pulse 1.2s ease-in-out infinite',
})

export const analysisLabel = css({
  fontSize: FontSize.sm,
  color: Colors.success,
  fontWeight: FontWeight.medium,
})

export const analysisLabelRunning = css({
  fontSize: FontSize.sm,
  color: Colors.orange,
  fontWeight: FontWeight.medium,
})

export const manualModeInfo = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1,
})

export const manualModeTitle = css({
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,
})

export const manualModeDesc = css({
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})
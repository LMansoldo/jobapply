import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

const SIDE_WIDTH = '28rem'

export const grid = css({
  display: 'grid',
  gridTemplateColumns: `1fr ${SIDE_WIDTH}`,
  gap: 0,
  height: '100%',
  minHeight: '40rem',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
})

export const mainPane = css({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.lg,
  gap: Spacing.md,
  overflowY: 'auto',
})

export const previewBox = css({
  flex: 1,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  padding: Spacing.lg,
  background: Colors.white,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  lineHeight: 1.75,
  color: Colors.textMain,
  whiteSpace: 'pre-wrap',
  overflowY: 'auto',
})

export const emptyState = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.lg,
  padding: Spacing.xxl,
  color: Colors.textSub,
  fontSize: FontSize.sm,
  fontFamily: FontFamily.body,
  textAlign: 'center',
})

export const emptyDescription = css({
  margin: 0,
  maxWidth: '40rem',
  lineHeight: 1.7,
})

export const sidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  background: Colors.surfacePage,
  '@media (max-width: 768px)': {
    borderLeft: 'none',
    borderTop: `1px solid ${Colors.surfaceBorder}`,
  },
})

export const aiCard = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  border: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const aiCardTitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: Colors.primaryDark,
  fontFamily: FontFamily.heading,
})

export const aiCardDesc = css({
  margin: 0,
  fontSize: FontSize.xs,
  color: Colors.textSub,
  fontFamily: FontFamily.body,
  lineHeight: 1.6,
})

export const generateBtn = css({
  width: '100%',
  padding: `${Spacing.sm} 0`,
  background: Colors.primaryDark,
  color: Colors.white,
  border: 'none',
  borderRadius: BorderRadius.full,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.88 },
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
})

export const actionRow = css({
  display: 'flex',
  gap: Spacing.sm,
})

export const actionBtn = css({
  flex: 1,
  padding: `${Spacing.sm} 0`,
  background: Colors.white,
  color: Colors.primaryDark,
  border: `1px solid ${Colors.primaryMid}`,
  borderRadius: BorderRadius.full,
  fontFamily: FontFamily.body,
  fontSize: FontSize.xs,
  fontWeight: FontWeight.semibold,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  '&:hover': { opacity: 0.8 },
})

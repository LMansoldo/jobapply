import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

const TEXTAREA_MIN_HEIGHT = '36rem'
const GRID_SIDE_WIDTH = '28rem'

export const videoGrid = css({
  display: 'grid',
  gridTemplateColumns: `1fr ${GRID_SIDE_WIDTH}`,
  gap: 0,
  height: '100%',
  minHeight: TEXTAREA_MIN_HEIGHT,
})

export const videoEditorPane = css({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.lg,
})

export const coverEditorBorder = css({
  flex: 1,
  border: `1px solid ${Colors.surfaceBorder}`,
  borderRadius: BorderRadius.base,
  overflow: 'hidden',
})

export const videoTextarea = css({
  width: '100%',
  height: '100%',
  minHeight: TEXTAREA_MIN_HEIGHT,
  border: 'none',
  outline: 'none',
  resize: 'none',
  padding: Spacing.lg,
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  lineHeight: 1.7,
  color: Colors.textMain,
  background: Colors.white,
})

export const videoSidePane = css({
  borderLeft: `1px solid ${Colors.surfaceBorder}`,
  padding: Spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
  background: Colors.surfacePage,
  justifyContent: 'flex-start',
})

export const videoScriptBtn = css({
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

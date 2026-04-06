import { css } from '@emotion/css'
import { Colors } from '../../styles/theme/colors'
import { Shadows } from '../../styles/theme/shadows'
import { BorderRadius } from '../../styles/theme/radius'
import { Spacing } from '../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../styles/theme/typography'

export const panel = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
})

export const jobListWrapper = css({
  display: 'flex',
  flexDirection: 'column',
})

export const jobCountRow = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: Spacing.md,
})

export const jobCountText = css({
  margin: 0,
  fontSize: FontSize.sm,
  color: Colors.textSub,
})

export const jobCountNumber = css({
  fontWeight: FontWeight.bold,
  color: Colors.textMain,
  fontFamily: FontFamily.heading,
})

export const panelWithOverflow = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export const spinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  padding: Spacing.xxl,
})

export const jobCardsWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.xs,
  padding: Spacing.sm,
})

export const rightPanelWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const heroOffset = css({
  marginTop: `-${Spacing.lg}`,
})

export const mobilePadding = css({
  padding: Spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const mobileModalHeader = (white: string, border: string) => css({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: white,
  borderBottom: `1px solid ${border}`,
  padding: `${Spacing.sm} ${Spacing.md}`,
})

export const mobileModalBody = css({
  padding: Spacing.md,
})

export const mobileJobTitle = css({
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.bold,
  color: Colors.textMain,
})

export const mobileJobCompany = css({
  color: Colors.textSub,
  fontSize: FontSize.sm,
})

export const mobileJobDescription = css({
  color: Colors.textMain,
  lineHeight: 1.7,
})

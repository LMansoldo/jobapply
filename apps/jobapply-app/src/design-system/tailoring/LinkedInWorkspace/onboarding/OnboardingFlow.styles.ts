import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'

export const root = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

export const header = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Spacing.md} ${Spacing.lg}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
})

export const stepCounter = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  color: Colors.textSub,
})

export const progressBar = css({
  height: '0.3rem',
  background: Colors.surfaceBorder,
  width: '100%',
})

export const progressFill = (pct: number) =>
  css({
    height: '100%',
    width: `${pct}%`,
    background: Colors.primaryDark,
    transition: 'width 0.3s ease',
  })

export const stepDots = css({
  display: 'flex',
  gap: Spacing.xs,
})

export const dot = css({
  width: '0.6rem',
  height: '0.6rem',
  background: Colors.surfaceBorder,
})

export const dotActive = css({
  width: '0.6rem',
  height: '0.6rem',
  background: Colors.primaryDark,
})

export const dotDone = css({
  width: '0.6rem',
  height: '0.6rem',
  background: Colors.primaryMid,
})

export const linkedinLabel = css({
  fontSize: FontSize.xs,
  fontFamily: FontFamily.body,
  fontWeight: FontWeight.semibold,
  color: Colors.socialLinkedin,
})

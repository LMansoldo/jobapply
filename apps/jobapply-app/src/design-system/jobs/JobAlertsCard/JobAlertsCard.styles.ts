import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

// ── Constants ──────────────────────────────────────────────
const ICON_SIZE = '3.6rem'       // 36px
const ICON_FONT_SIZE = '1.8rem'  // 18px = FontSize.lg
const BADGE_MIN_WIDTH = '2.4rem' // 24px
const VERTICAL_PADDING = Spacing.xxs  // 2px

export const NewAlertBtn = styled.button`
  background: none;
  border: 1px solid ${Colors.primaryDark};
  border-radius: ${BorderRadius.full};
  color: ${Colors.primaryDark};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  padding: ${VERTICAL_PADDING} ${Spacing.sm};
  cursor: pointer;
  font-family: ${FontFamily.body};
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.md};
  padding: ${Spacing.sm2} 0;
`

export const IconCircle = styled.div`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};
  border-radius: ${BorderRadius.full};
  background: ${Colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${ICON_FONT_SIZE};
  flex-shrink: 0;
`

export const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const AlertTitle = styled.p`
  margin: 0;
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.semibold};
  color: ${Colors.textMain};
  line-height: 1.3;
`

export const AlertSubtitle = styled.p`
  margin: ${Spacing.xxs} 0 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
`

export const Badge = styled.div`
  background: ${Colors.primaryDark};
  color: ${Colors.white};
  border-radius: ${BorderRadius.full};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
  padding: ${VERTICAL_PADDING} ${Spacing.sm};
  min-width: ${BADGE_MIN_WIDTH};
  text-align: center;
  flex-shrink: 0;
`

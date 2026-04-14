import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

// ── Constants ──────────────────────────────────────────────
const PULSE_DOT_SIZE = '0.8rem'         // 8px
const BTN_BORDER_RADIUS = '0.6rem'      // 6px
const BTN_VERT_PADDING = Spacing.xxs    // 2px
const COUNTER_MIN_WIDTH = '3rem'        // 30px

export const Banner = styled.div`
  background: ${Colors.gradientAiToolbar};
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: ${BorderRadius.base};
  padding: ${Spacing.sm} ${Spacing.lg};
  display: flex;
  align-items: center;
  gap: ${Spacing.md};
  flex-wrap: wrap;
`

export const PulseDot = styled.span`
  width: ${PULSE_DOT_SIZE};
  height: ${PULSE_DOT_SIZE};
  border-radius: ${BorderRadius.full};
  background: ${Colors.primaryDark};
  flex-shrink: 0;
  animation: pulse 2s infinite;
`

export const Message = styled.span`
  flex: 1;
  font-size: ${FontSize.sm};
  color: ${Colors.primaryDark};
  font-weight: ${FontWeight.medium};
  min-width: 20rem;
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
`

export const NavBtn = styled.button`
  background: none;
  border: 1px solid ${Colors.primaryDark};
  border-radius: ${BTN_BORDER_RADIUS};
  color: ${Colors.primaryDark};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.medium};
  padding: ${BTN_VERT_PADDING} ${Spacing.sm};
  cursor: pointer;
  font-family: ${FontFamily.body};
`

export const Counter = styled.span`
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
  min-width: ${COUNTER_MIN_WIDTH};
  text-align: center;
`

export const AcceptAllBtn = styled.button`
  background: ${Colors.primaryDark};
  border: none;
  border-radius: ${BorderRadius.full};
  color: ${Colors.white};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  padding: ${Spacing.xs} ${Spacing.md};
  cursor: pointer;
  font-family: ${FontFamily.body};
`

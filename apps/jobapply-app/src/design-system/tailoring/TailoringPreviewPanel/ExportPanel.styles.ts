import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { LetterSpacing } from '../../../styles/theme/typography'

// ── Constants ──────────────────────────────────────────────
const SCORE_BADGE_VERT_PADDING = Spacing.xxs   // 2px

export const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-left: 1px solid ${Colors.surfaceBorder};
`

// Scrollable area that holds the ATSPanel — keeps export buttons always visible
export const ScrollableContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

export const ScoreRow = styled.div`
  background: ${Colors.successBg};
  border-bottom: 1px solid ${Colors.surfaceBorder};
  padding: ${Spacing.sm} ${Spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${Spacing.sm};
`

export const ScoreText = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
`

export const ScoreBadge = styled.span`
  background: ${Colors.success};
  color: ${Colors.white};
  border-radius: ${BorderRadius.full};
  padding: ${SCORE_BADGE_VERT_PADDING} ${Spacing.sm};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
`

export const ExportSection = styled.div`
  flex-shrink: 0;
  background: ${Colors.surfacePage};
  border-top: 1px solid ${Colors.surfaceBorder};
  padding: ${Spacing.lg};
`

export const ExportLabel = styled.p`
  margin: 0 0 ${Spacing.md};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
  color: ${Colors.textSub};
  text-transform: uppercase;
  letter-spacing: ${LetterSpacing.label};
`

export interface ExportBtnProps {
  primary?: boolean
}

export const ExportBtn = styled.button<ExportBtnProps>`
  width: 100%;
  padding: ${Spacing.sm} 0;
  background: ${({ primary }) => (primary ? Colors.primaryDark : Colors.white)};
  color: ${({ primary }) => (primary ? Colors.white : Colors.primaryDark)};
  border: 1.5px solid ${Colors.primaryDark};
  border-radius: ${BorderRadius.base};
  font-family: ${FontFamily.body};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.medium};
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: ${Spacing.sm};
`

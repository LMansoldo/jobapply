import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'
import { LetterSpacing } from '../../../styles/theme/typography'

// ── Constants ──────────────────────────────────────────────
const TAB_BORDER_BOTTOM_WIDTH = '2px'
const SCORE_BADGE_VERT_PADDING = Spacing.xxs   // 2px

export const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid ${Colors.surfaceBorder};
`

export const TabBar = styled.div`
  border-bottom: 1px solid ${Colors.surfaceBorder};
  display: flex;
  padding: 0 ${Spacing.sm};
  background: ${Colors.white};
`

export interface TabBtnProps {
  active: boolean
}

export const TabBtn = styled.button<TabBtnProps>`
  padding: ${Spacing.sm} ${Spacing.md};
  border: none;
  background: none;
  font-family: ${FontFamily.body};
  font-size: ${FontSize.sm};
  font-weight: ${({ active }) => (active ? FontWeight.semibold : FontWeight.regular)};
  color: ${({ active }) => (active ? Colors.primaryDark : Colors.textSub)};
  border-bottom: ${TAB_BORDER_BOTTOM_WIDTH} solid
    ${({ active }) => (active ? Colors.primaryDark : 'transparent')};
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
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

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${Spacing.lg};
  max-height: 40vh;
`

export const PreviewTitle = styled.p`
  font-weight: ${FontWeight.bold};
  margin-bottom: ${Spacing.sm};
  color: ${Colors.textMain};
`

export const PreviewPlaceholder = styled.p`
  color: ${Colors.textSub};
`

export const MarkdownWrapper = styled.div`
  font-family: ${FontFamily.body};
  font-size: ${FontSize.xxs};
  color: ${Colors.textMain};
  line-height: 1.3;

  h1 {
    font-size: ${FontSize.md};
    font-weight: ${FontWeight.bold};
    margin: 0 0 ${Spacing.md};
    padding-bottom: ${Spacing.sm};
    border-bottom: 2px solid ${Colors.primaryDark};
    color: ${Colors.textMain};
  }

  h2 {
    font-size: ${FontSize.md0};
    font-weight: ${FontWeight.semibold};
    margin: ${Spacing.lg} 0 ${Spacing.sm};
    color: ${Colors.textSub};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  h3 {
    font-size: ${FontSize.xxs};
    font-weight: ${FontWeight.semibold};
    margin: ${Spacing.md} 0 ${Spacing.xs};
    color: ${Colors.textMain};
  }

  p {
    margin: ${Spacing.sm2} 0;
  }

  ul {
    margin: ${Spacing.xs} 0;
    padding-left: ${Spacing.lg};
  }

  li {
    margin: ${Spacing.xxs} 0;
  }

  strong {
    font-weight: ${FontWeight.semibold};
  }

  em {
    color: ${Colors.textSub};
  }

  hr {
    border: none;
    border-top: 1px solid ${Colors.surfaceBorder};
    margin: ${Spacing.md} 0;
  }

  blockquote {
    display: none;
  }
`

export const JobTitle = styled.h4`
  font-family: ${FontFamily.heading};
  font-weight: ${FontWeight.semibold};
  margin-bottom: ${Spacing.md};
  color: ${Colors.textMain};
`

export const JobCompany = styled.p`
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
  margin-bottom: ${Spacing.sm};
`

export const JobDescription = styled.p`
  font-size: ${FontSize.sm};
  color: ${Colors.textMain};
  line-height: 1.7;
`

export const ExportSection = styled.div`
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

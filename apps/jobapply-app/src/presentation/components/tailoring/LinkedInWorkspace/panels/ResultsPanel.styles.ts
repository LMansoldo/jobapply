import styled from '@emotion/styled'
import type { UITheme } from '@jobapply/ui'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 30rem;
  min-height: 40rem;

  ${({ theme }) => theme.mediaQueries.tabletDown} {
    grid-template-columns: 1fr;
  }
`

export const MainPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`

export const SidePane = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfacePage};
  overflow-y: auto;

  ${({ theme }) => theme.mediaQueries.tabletDown} {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  }
`

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const LinkedinBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme }) => theme.colors.socialLinkedin};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  letter-spacing: 0.04em;
`

export const ScoreChip = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
`

export const ScoreNumber = styled.span`
  font-size: ${({ theme }) => theme.typography.size.h3};
  font-weight: ${({ theme }) => theme.typography.weight.extrabold};
  font-family: ${({ theme }) => theme.typography.family.heading};
  color: ${({ theme }) => theme.colors.primaryDark};
  line-height: 1;
`

export const ScoreDivider = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
`

export const PriorityBanner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.warningBg};
  border: 1px solid ${({ theme }) => theme.colors.warning};
`

export const PriorityLabel = styled.span`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.warning};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const PriorityText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const SectionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const SectionLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.primaryDark};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const SubLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export type ScoreVariant = 'danger' | 'warning' | 'success'

const scoreVariantColors: Record<ScoreVariant, (theme: UITheme) => string> = {
  danger: (t) => `color: ${t.colors.danger}; background: ${t.colors.dangerBg};`,
  warning: (t) => `color: ${t.colors.warning}; background: ${t.colors.warningBg};`,
  success: (t) => `color: ${t.colors.success}; background: ${t.colors.successBg};`,
}

export const ScoreBadge = styled.span<{ $variant: ScoreVariant }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  padding: 0.2rem ${({ theme }) => theme.spacing.sm};
  text-transform: capitalize;
  ${({ theme, $variant }) => scoreVariantColors[$variant](theme)}
`

export const AlternativesList = styled.ol`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const AlternativeItem = styled.li`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const IssuesList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const IssueItem = styled.li`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const RewriteText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.spacious};
  white-space: pre-wrap;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.successBg};
  border: 1px solid ${({ theme }) => theme.colors.success};
`

export const GapBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
`

export const GapRole = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
`

export const DiffRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const DiffPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfacePage};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`

export const DiffLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const DiffText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const ScoreBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const BulletList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const BulletGreen = styled.li`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  padding-left: ${({ theme }) => theme.spacing.md};
  position: relative;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.success};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }
`

export const BulletRed = styled.li`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  padding-left: ${({ theme }) => theme.spacing.md};
  position: relative;

  &::before {
    content: '✗';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.danger};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }
`

export const KeywordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const KeywordGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const KeywordGroupLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
`

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Tag = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.primaryDark};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
  padding: 0.2rem ${({ theme }) => theme.spacing.sm};
`

export const QuickWinsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const QuickWinsList = styled.ol`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const QuickWinItem = styled.li`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const VoiceProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
`

export const VoiceSubLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.primaryDark};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const QualityNote = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  font-style: italic;
`

export const NewAnalysisBtn = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  background: ${({ theme }) => theme.colors.socialLinkedin};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: auto;

  &:hover {
    opacity: 0.88;
  }
`

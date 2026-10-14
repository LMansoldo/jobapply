import styled from '@emotion/styled'
import { FontSize, FontWeight } from '../../../styles/theme/typography'

// Values without theme token equivalents (kept literal, 1rem = 10px)
const SKILL_BAR_HEIGHT = '0.6rem'        // 6px
const SKILL_BAR_RADIUS = '0.3rem'        // 3px
const LIST_GAP = '0.4rem'                // 4px
const LIST_GAP_SM = '0.2rem'             // 2px
const BADGE_RADIUS = '1.2rem'            // 12px
const SUMMARY_LINE_HEIGHT = 1.6          // no lineHeight token at 1.6
const DETAILS_LINE_HEIGHT = 1.5          // no lineHeight token at 1.5

export const Panel = styled.div`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.surfacePage};
`

export const SectionHeading = styled.div`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.primaryDark};
  text-transform: uppercase;
  letter-spacing: 0.12rem;
  border-bottom: 0.2rem solid ${({ theme }) => theme.colors.primaryLight};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const SkillLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${LIST_GAP};
`

export const SkillName = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textMain};
`

export const SkillPercent = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textSub};
`

export const SkillBarTrack = styled.div`
  height: ${SKILL_BAR_HEIGHT};
  background: ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${SKILL_BAR_RADIUS};
  overflow: hidden;
`

export const SkillBarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  background: ${({ theme }) => theme.colors.gradientProgressBar};
  border-radius: ${SKILL_BAR_RADIUS};
`

export const GroupsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const GroupLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.primaryDark};
`

export const GroupItems = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${SUMMARY_LINE_HEIGHT};
`

export const LanguagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const LanguageRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const LanguageName = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textMain};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`

export const LanguageLevelBadge = styled.span<{ $native: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: 0.2rem ${({ theme }) => theme.spacing.sm};
  border-radius: ${BADGE_RADIUS};
  background: ${({ theme, $native }) => ($native ? theme.colors.successBg : theme.colors.blueBg)};
  color: ${({ theme, $native }) => ($native ? theme.colors.success : theme.colors.blue)};
`

export const CertificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const CertificationName = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
`

export const CertificationMeta = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textSub};
`

export const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const ProjectName = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
`

export const ProjectUrl = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.blue};
`

export const ProjectDescription = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${DETAILS_LINE_HEIGHT};
`

export const ProjectHighlights = styled.ul`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  padding-left: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${LIST_GAP_SM};
`

export const ProjectHighlight = styled.li`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textMain};
`

import styled from '@emotion/styled'
import { Spacing } from '../../../styles/theme/spacing'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { BorderRadius } from '../../../styles/theme/radius'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  // 6.4rem = height of AppHeader (Ant Design Layout.Header default = 64px)
  height: calc(100vh - 6.4rem);
  overflow: hidden;

  @media ${({ theme }) => theme.mediaQueries.tabletDown} {
    height: auto;
    min-height: calc(100vh - 11.2rem);
    overflow: visible;
  }
`

export const WorkspaceContainer = styled.div`
  max-width: 128rem;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.mediaQueries.tabletDown} {
    overflow: visible;
    flex: none;
    height: auto;
  }
`

export const SpinWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`

export const ContextBar = styled.div`
  background: ${Colors.white};
  border-bottom: 1px solid ${Colors.surfaceBorder};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  gap: ${Spacing.md};
  flex-shrink: 0;
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  color: ${Colors.primaryDark};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.xs};
  font-family: ${FontFamily.body};
`

export const ContextDivider = styled.div`
  width: 1px;
  height: 2rem;
  background: ${Colors.surfaceBorder};
`

export const AnalysisStatus = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${Spacing.xs};
`

export const AnalysisDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${Colors.success};
  flex-shrink: 0;
`

export const AnalysisDotRunning = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${Colors.orange};
  flex-shrink: 0;
  animation: pulse 1.2s ease-in-out infinite;
`

export const AnalysisLabel = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.success};
  font-weight: ${FontWeight.medium};
`

export const AnalysisLabelRunning = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.orange};
  font-weight: ${FontWeight.medium};
`

export const WorkspaceTabs = styled.div`
  background: ${Colors.white};
  border-bottom: 1px solid ${Colors.surfaceBorder};
  padding: 0 ${Spacing.md};
  display: flex;
  align-items: center;
  gap: ${Spacing.xs};
  flex-shrink: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 ${Spacing.lg};
  }
`

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: none;
  background: none;
  font-family: ${FontFamily.body};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.semibold};
  color: ${({ $active }) => ($active ? Colors.primaryDark : Colors.textSub)};
  cursor: pointer;
  border-bottom: 2px solid ${({ $active }) => ($active ? Colors.primary : 'transparent')};
  display: flex;
  align-items: center;
  gap: ${Spacing.xs};
  white-space: nowrap;
  transition: color .15s, border-color .15s;
`

export const TabBadge = styled.span<{ $bg: string; $fg: string }>`
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border-radius: 10px;
  padding: 0 ${Spacing.xs};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
`

export const AtsGrid = styled.div`
  display: grid;
  // Mobile: 1 column (full width editor)
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  flex: 1;
  min-height: 0;
  overflow: auto;

  // Tablet: 2 columns (ATS hidden in drawer, editor + preview)
  @media ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 30rem;
    grid-template-rows: 1fr;
  }

  // Desktop: 3 columns (ATS + editor + preview)
  @media ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 25rem 1fr 50rem;
    grid-template-rows: 1fr;
  }
`

export const AtsLeft = styled.div`
  background: ${Colors.white};
  border-right: 1px solid ${Colors.surfaceBorder};
  overflow-y: auto;
  padding: ${Spacing.lg};
  display: none;

  @media ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

export const AtsScoreBadge = styled.div`
  background: ${Colors.successBg};
  color: ${Colors.success};
  border-radius: ${BorderRadius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  text-align: center;
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.semibold};
  margin-top: ${Spacing.md};
`

export const ReanalyzeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${Spacing.md};
`

export const AtsCenter = styled.div`
  background: ${Colors.surfaceEditor};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`

export const AtsCenterToolbar = styled.div`
  background: ${Colors.surfaceDarker};
  border-bottom: 1px solid ${Colors.surfaceEditorBorder};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
  flex-shrink: 0;
`

export const ToolbarMonoLabel = styled.span`
  font-size: ${FontSize.xxs};
  color: rgba(255,255,255,0.5);
  font-family: ${FontFamily.mono};
`

export const ToolbarBtns = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${Spacing.sm};
`

export const AcceptAllBtn = styled.button`
  background: ${Colors.success};
  border: none;
  border-radius: 6px;
  color: ${Colors.white};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  padding: 3px ${Spacing.sm};
  cursor: pointer;
  font-family: ${FontFamily.body};
`

export const RejectAllBtn = styled.button`
  background: ${Colors.danger};
  border: none;
  border-radius: 6px;
  color: ${Colors.white};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  padding: 3px ${Spacing.sm};
  cursor: pointer;
  font-family: ${FontFamily.body};
`

export const SuggestionBannerPad = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  flex-shrink: 0;
`

export const SuggestionCard = styled.div`
  margin: ${({ theme }) => `0 ${theme.spacing.lg} ${theme.spacing.sm}`};
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: ${BorderRadius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.sm};
  flex-shrink: 0;
`

export const SuggestionCardIcon = styled.span`
  font-size: 1.4rem;
  line-height: 2rem;
  flex-shrink: 0;
`

export const SuggestionCardText = styled.span`
  font-size: ${FontSize.sm};
  color: rgba(124, 58, 237, 0.9);
  font-family: ${FontFamily.body};
  line-height: 1.5;
  flex: 1;
`

export const KeywordsArea = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xs};
`

export const KeywordsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`

export const KeywordsLabel = styled.span`
  font-size: ${FontSize.xxs};
  color: rgba(255,255,255,0.45);
  font-family: ${FontFamily.mono};
  flex-shrink: 0;
`

export const KeywordChipAdd = styled.button`
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 4px;
  color: rgba(239, 68, 68, 0.85);
  font-size: ${FontSize.xxs};
  font-family: ${FontFamily.mono};
  padding: 2px 8px;
  cursor: pointer;
  line-height: 1.6;

  &:hover {
    background: rgba(239, 68, 68, 0.22);
  }
`

export const KeywordChipRephrase = styled.button`
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 4px;
  color: rgba(245, 158, 11, 0.85);
  font-size: ${FontSize.xxs};
  font-family: ${FontFamily.mono};
  padding: 2px 8px;
  cursor: pointer;
  line-height: 1.6;

  &:hover {
    background: rgba(245, 158, 11, 0.22);
  }
`

export const EditorArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${({ theme }) => `0 ${theme.spacing.lg} ${theme.spacing.lg}`};
`

export const TailoringSpinWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const EditorTextarea = styled.textarea`
  width: 100%;
  min-height: 40rem;
  background: transparent;
  color: rgba(255,255,255,0.9);
  font-family: ${FontFamily.mono};
  font-size: ${FontSize.sm};
  border: 1px solid ${Colors.surfaceEditorBorder};
  border-radius: ${BorderRadius.base};
  padding: ${Spacing.lg};
  box-sizing: border-box;
  line-height: 1.75;
  outline: none;
  resize: none;
`

export const StatusBar = styled.div`
  background: ${Colors.surfaceDarker};
  border-top: 1px solid ${Colors.surfaceEditorBorder};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  display: flex;
  gap: ${Spacing.lg};
  font-size: ${FontSize.xxs};
  color: rgba(255,255,255,0.4);
  font-family: ${FontFamily.mono};
  flex-shrink: 0;
`

export const StatusBarRight = styled.span`
  margin-left: auto;
`

export const CoverGrid = styled.div`
  flex: 1;
  display: grid;
  // Mobile: 1 column (editor full width)
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  overflow: hidden;

  // Tablet and up: 2 columns (editor + sidebar)
  @media ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 30rem;
    grid-template-rows: 1fr;
  }
`

export const CoverEditorPane = styled.div`
  padding: ${Spacing.lg};
  overflow-y: auto;
  background: ${Colors.white};
`

export const CoverEditorBorder = styled.div`
  border: 1px solid ${Colors.surfaceBorder};
  border-radius: ${BorderRadius.base};
  overflow: hidden;
`

export const CoverTextarea = styled.textarea`
  width: 100%;
  min-height: 24rem;
  padding: ${Spacing.lg};
  border: none;
  outline: none;
  font-family: ${FontFamily.body};
  font-size: ${FontSize.base};
  line-height: 1.75;
  color: ${Colors.textMain};
  resize: none;
  background: transparent;

  @media ${({ theme }) => theme.mediaQueries.md} {
    min-height: 36rem;
  }
`

export const CoverSidePane = styled.div`
  border-left: 1px solid ${Colors.surfaceBorder};
  padding: ${Spacing.lg};
  background: ${Colors.surfacePage};
  overflow-y: auto;
  border-left-width: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${Colors.surfaceBorder};

  @media ${({ theme }) => theme.mediaQueries.md} {
    border-left-width: 1;
    border-top-width: 0;
  }
`

export const AiCard = styled.div`
  background: ${Colors.white};
  border: 1px solid ${Colors.surfaceBorder};
  border-radius: ${BorderRadius.base};
  padding: ${Spacing.lg};
  margin-bottom: ${Spacing.md};
`

export const AiCardTitle = styled.h4`
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  margin: ${({ theme }) => `0 0 ${theme.spacing.md}`};
  color: ${Colors.primaryDark};
`

export const AiGenBtn = styled.button`
  width: 100%;
  margin-top: ${Spacing.md};
  background: ${Colors.primaryDark};
  color: ${Colors.white};
  border: none;
  border-radius: ${BorderRadius.base};
  padding: ${Spacing.sm};
  font-family: ${FontFamily.body};
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  cursor: pointer;
`

export const VideoGrid = styled.div`
  flex: 1;
  display: grid;
  // Mobile: 1 column (editor full width)
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  overflow: hidden;

  // Tablet and up: 2 columns (editor + sidebar)
  @media ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 30rem;
    grid-template-rows: 1fr;
  }
`

export const VideoEditorPane = styled.div`
  padding: ${Spacing.lg};
  overflow-y: auto;
  background: ${Colors.white};
`

export const VideoTextarea = styled.textarea`
  width: 100%;
  min-height: 30rem;
  padding: ${Spacing.lg};
  border: none;
  outline: none;
  font-family: ${FontFamily.body};
  font-size: ${FontSize.base};
  line-height: 1.75;
  color: ${Colors.textMain};
  resize: none;
  background: transparent;

  @media ${({ theme }) => theme.mediaQueries.md} {
    min-height: 48rem;
  }
`

export const VideoSidePane = styled.div`
  border-left: 1px solid ${Colors.surfaceBorder};
  padding: ${Spacing.lg};
  background: ${Colors.surfacePage};
  overflow-y: auto;
  border-left-width: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${Colors.surfaceBorder};

  @media ${({ theme }) => theme.mediaQueries.md} {
    border-left-width: 1;
    border-top-width: 0;
  }
`

export const VideoScriptBtn = styled.button`
  width: 100%;
  margin-bottom: ${Spacing.md};
  background: ${Colors.primaryDark};
  color: ${Colors.white};
  border: none;
  border-radius: ${BorderRadius.base};
  padding: ${Spacing.sm};
  font-family: ${FontFamily.body};
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  cursor: pointer;
`

// ── Setup dialog (2-step locale + job description) ───────────────────────────

export const SetupSteps = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
  margin-bottom: ${Spacing.lg};
`

export const SetupStepDot = styled.div<{ $active: boolean }>`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
  flex-shrink: 0;
  background: ${({ $active }) => ($active ? Colors.primaryDark : Colors.surfaceBorder)};
  color: ${({ $active }) => ($active ? Colors.white : Colors.textSub)};
  transition: background 0.2s;
`

export const SetupStepLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${Colors.surfaceBorder};
`

export const SetupStepLabel = styled.span<{ $active: boolean }>`
  font-size: ${FontSize.xxs};
  color: ${({ $active }) => ($active ? Colors.primaryDark : Colors.textSub)};
  font-weight: ${({ $active }) => ($active ? FontWeight.semibold : FontWeight.regular)};
  flex-shrink: 0;
`

export const SetupSectionTitle = styled.p`
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.semibold};
  color: ${Colors.textMain};
  margin: ${({ theme }) => `0 0 ${theme.spacing.sm}`};
`

export const SetupLocaleRow = styled.div`
  display: flex;
  gap: ${Spacing.md};
  margin-top: ${Spacing.sm};
`

export const SetupLocaleBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid ${({ $active }) => ($active ? Colors.primaryDark : Colors.surfaceBorder)};
  border-radius: ${BorderRadius.base};
  background: ${({ $active }) => ($active ? Colors.primaryLight : Colors.white)};
  color: ${({ $active }) => ($active ? Colors.primaryDark : Colors.textMain)};
  font-family: ${FontFamily.body};
  font-size: ${FontSize.base};
  font-weight: ${FontWeight.semibold};
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;

  &:hover {
    border-color: ${Colors.primaryDark};
    background: ${Colors.primaryLight};
  }
`

export const SetupTip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.sm};
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: ${BorderRadius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  margin-bottom: ${Spacing.md};
`

export const SetupTipText = styled.p`
  font-size: ${FontSize.sm};
  color: ${Colors.orange};
  line-height: 1.5;
  margin: 0;
`

export const SetupJdTextarea = styled.textarea`
  width: 100%;
  min-height: 22rem;
  border: 1px solid ${Colors.surfaceBorder};
  border-radius: ${BorderRadius.base};
  padding: ${Spacing.md};
  font-family: ${FontFamily.body};
  font-size: ${FontSize.sm};
  line-height: 1.6;
  color: ${Colors.textMain};
  outline: none;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    border-color: ${Colors.primaryDark};
  }
`

export const SetupModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${Spacing.lg};
  border-top: 1px solid ${Colors.surfaceBorder};
  margin-top: ${Spacing.lg};
`

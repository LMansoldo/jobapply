import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

// Re-export theme tokens for use in presentational components
export { Colors, FontSize, FontWeight, FontFamily, Spacing, BorderRadius }

const TOOLBAR_HEIGHT = '7.2rem'
const STATUS_HEIGHT = '2.4rem'
const BTN_SIZE = '2.6rem'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${Colors.surfaceEditor};
`

export const Toolbar = styled.div`
  height: ${TOOLBAR_HEIGHT};
  background: ${Colors.surfaceDarker};
  border-bottom: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 ${Spacing.md};
  gap: ${Spacing.xxs};
  flex-shrink: 0;
`
export const MenusRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${Spacing.xxs};
`

export const Tools = styled.div`
    flex-direction: row;
    display: flex;
    justify-content: flex-start;
`


export interface ToolbarBtnProps {
  active?: boolean
  wide?: boolean
}

export const ToolbarBtn = styled.button<ToolbarBtnProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${Spacing.xxs};
  min-width: ${BTN_SIZE};
  height: ${BTN_SIZE};
  padding: 0 ${({ wide }) => (wide ? Spacing.sm : Spacing.xs)};
  border: none;
  background: ${({ active }) => (active ? 'rgba(124,58,237,0.25)' : 'transparent')};
  color: ${({ active }) => (active ? Colors.primary : 'rgba(255,255,255,0.65)')};
  font-size: ${FontSize.md0};
  font-weight: ${({ wide }) => (wide ? FontWeight.semibold : FontWeight.regular)};
  font-family: ${FontFamily.body};
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
  }
`

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 1.6rem;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 ${Spacing.xxs};
  flex-shrink: 0;
`

export const EditorWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  position: relative;
  overscroll-behavior: contain;
  touch-action: pan-y;

  @media (max-width: 768px) {
    overflow: auto;
    min-height: auto;
    flex: none;
    height: 50vh;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }
`

export const StatusBar = styled.div`
  height: ${STATUS_HEIGHT};
  background: ${Colors.surfaceDarker};
  border-top: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  align-items: center;
  gap: ${Spacing.lg};
  padding: 0 ${Spacing.lg};
  font-family: ${FontFamily.mono};
  font-size: ${FontSize.xxs};
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
`

export const StatusRight = styled.span`
  margin-left: auto;
`

// Diff styling classes
export const diffStyles = `
  .te-diff-insert {
    background: rgba(34, 197, 94, 1);
    border-radius: 0 2px 2px 0;
  }

  .te-diff-delete {
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.7);
    text-decoration-thickness: 2px;
    background:  rgba(239, 68, 68, 0.5);
    border-radius: 0 2px 2px 0;
    color: rgba(255, 255, 255, 0.5);
  }

  .te-diff-replace {
    background: rgba(245, 158, 11, 0.5);
    border-radius: 0 2px 2px 0;
  }
`

// For FileDropdownMenu
export const FileMenuWrapper = styled.div`
  position: relative;
`

export const FileMenuDrop = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${Colors.surfaceDarker};
  border: 1px solid ${Colors.surfaceEditorBorder};
  min-width: 20rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
`

export const FileMenuList = styled.div`
  padding: ${Spacing.xs} 0;
`

export const MenuItemRow = styled.button`
  width: 100%;
  padding: ${Spacing.xs} ${Spacing.md};
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  font-size: ${FontSize.sm};
  font-family: ${FontFamily.body};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.35);
    cursor: not-allowed;
  }
`

export const SubmenuDrop = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  background: ${Colors.surfaceDarker};
  border: 1px solid ${Colors.surfaceEditorBorder};
  min-width: 18rem;
  max-height: 30rem;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
`

export const SubmenuItem = styled.button`
  width: 100%;
  padding: ${Spacing.xs} ${Spacing.md};
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  font-size: ${FontSize.sm};
  font-family: ${FontFamily.body};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`

export const NotificationDot = styled.div`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: ${BorderRadius.avatar};
  background: #ff4d4f;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  animation: pulse 1.5s infinite;
`

// For PhrasesModal
export const PhrasesModalBody = styled.div`
  padding: ${Spacing.lg} ${Spacing.xl};
`

export const PhrasesModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
  margin-bottom: ${Spacing.lg};
`

export const PulseDot = styled.span`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: ${BorderRadius.avatar};
  background: ${Colors.primaryDark};
  flex-shrink: 0;
  animation: pulse 2s infinite;
`

export const PhrasesModalTitle = styled.span`
  font-size: ${FontSize.md};
  color: ${Colors.primary};
  font-weight: ${FontWeight.semibold};
`

export const PhraseList = styled.div`
  max-height: 40rem;
  overflow-y: auto;
`

export const PhraseItem = styled.div`
  padding: ${Spacing.md};
  margin-bottom: ${Spacing.sm};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${Colors.surfaceEditorBorder};
  border-radius: ${BorderRadius.xs};
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.md};
`

export const PhraseCheckbox = styled.input`
  width: 1.6rem;
  height: 1.6rem;
  margin-top: 0.2rem;
  accent-color: ${Colors.primary};
  cursor: pointer;
  flex-shrink: 0;
`

export const PhraseComparison = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
  flex-wrap: wrap;
`

export const PhraseFrom = styled.span`
  font-size: ${FontSize.sm};
  color: rgba(239, 68, 68, 0.8);
  background: rgba(239, 68, 68, 0.1);
  text-decoration: line-through;
  text-decoration-color: rgba(239, 68, 68, 0.9);
  text-decoration-thickness: 2px;
  padding: 0.2rem ${Spacing.xs};
  border-radius: 2px;
  word-break: break-word;
`

export const PhraseArrow = styled.span`
  color: rgba(255, 255, 255, 0.3);
  font-size: ${FontSize.xs};
  flex-shrink: 0;
`

export const PhraseTo = styled.span`
  font-size: ${FontSize.sm};
  color: rgba(34, 197, 94, 0.95);
  background: rgba(34, 197, 94, 0.12);
  padding: 0.2rem ${Spacing.xs};
  border-radius: 2px;
  font-weight: ${FontWeight.medium};
  word-break: break-word;
`

export const PhrasesModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${Spacing.lg};
  padding-top: ${Spacing.md};
  border-top: 1px solid ${Colors.surfaceEditorBorder};
`

export const ModalCloseBtn = styled.button`
  background: none;
  border: 1px solid ${Colors.surfaceEditorBorder};
  border-radius: ${BorderRadius.xs};
  color: rgba(255, 255, 255, 0.65);
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.medium};
  font-family: ${FontFamily.body};
  padding: ${Spacing.xs} ${Spacing.md};
  cursor: pointer;

  &:hover {
    border-color: ${Colors.primary};
    color: ${Colors.primary};
  }
`

export const ModalConfirmBtn = styled.button`
  background: rgba(124, 58, 237, 0.25);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: ${BorderRadius.xs};
  color: ${Colors.primary};
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  font-family: ${FontFamily.body};
  padding: ${Spacing.xs} ${Spacing.md};
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(124, 58, 237, 0.4);
    color: ${Colors.white};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

// Additional styled components for inline style fixes
export const RightArrowIcon = styled.span`
  .anticon {
    font-size: 0.8rem;
    opacity: 0.6;
  }
`

export const MenuItemIcon = styled.span`
  font-size: 1.2rem;
  opacity: 0.6;
`

export const MenuDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: ${Spacing.xs} 0;
`

export const JobTitleSpan = styled.span`
  font-size: ${FontSize.xxs};
  opacity: 0.6;
  font-style: italic;
`

export const EmptyStateDiv = styled.div`
  padding: ${Spacing.xl};
  text-align: center;
  color: ${Colors.primary};
  opacity: 0.7;
  font-size: ${FontSize.sm};
`

// For TipsModal
const PRIORITY_COLORS: Record<string, string> = {
  critical: 'rgba(239,68,68,0.85)',
  high: 'rgba(245,158,11,0.85)',
  medium: 'rgba(234,179,8,0.85)',
  low: 'rgba(34,197,94,0.85)',
}
const PRIORITY_BG: Record<string, string> = {
  critical: 'rgba(239,68,68,0.08)',
  high: 'rgba(245,158,11,0.08)',
  medium: 'rgba(234,179,8,0.08)',
  low: 'rgba(34,197,94,0.08)',
}
const PRIORITY_BORDER: Record<string, string> = {
  critical: 'rgba(239,68,68,0.25)',
  high: 'rgba(245,158,11,0.25)',
  medium: 'rgba(234,179,8,0.25)',
  low: 'rgba(34,197,94,0.25)',
}

export const TipItem = styled.div<{ priority: string }>`
  padding: ${Spacing.md};
  margin-bottom: ${Spacing.sm};
  background: ${({ priority }) => PRIORITY_BG[priority] ?? PRIORITY_BG.medium};
  border: 1px solid ${({ priority }) => PRIORITY_BORDER[priority] ?? PRIORITY_BORDER.medium};
  border-radius: ${BorderRadius.xs};
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xs};
`

export const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
`

export const PriorityBadge = styled.span<{ priority: string }>`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  font-family: ${FontFamily.body};
  color: ${({ priority }) => PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.medium};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
`

export const TipText = styled.p`
  font-size: ${FontSize.sm};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
`

export const TipPlatforms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Spacing.xxs};
  margin-top: ${Spacing.xxs};
`

export const PlatformTag = styled.span`
  font-size: ${FontSize.xxs};
  color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${BorderRadius.xs};
  padding: 0.1rem ${Spacing.xs};
`

// For RemoveSuggestionsModal
export const RemoveItem = styled.div`
  padding: ${Spacing.md};
  margin-bottom: ${Spacing.sm};
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${BorderRadius.xs};
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`

export const RemoveItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.sm};
`

export const SectionBadge = styled.span`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  font-family: ${FontFamily.body};
  color: rgba(239, 68, 68, 0.9);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${BorderRadius.xs};
  padding: 0.1rem ${Spacing.xs};
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const RemoveItemText = styled.p`
  font-size: ${FontSize.sm};
  color: rgba(255, 255, 255, 0.85);
  font-weight: ${FontWeight.medium};
  margin: 0;
  line-height: 1.4;
`

export const RemoveReasonText = styled.p`
  font-size: ${FontSize.xs};
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
`

// For SemanticGapsModal
export const GapItem = styled.div`
  padding: ${Spacing.md};
  margin-bottom: ${Spacing.sm};
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: ${BorderRadius.xs};
  font-size: ${FontSize.sm};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`

// For KeywordPhrasesModal
export const KPhraseItem = styled.div`
  padding: ${Spacing.md};
  margin-bottom: ${Spacing.sm};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${Colors.surfaceEditorBorder};
  border-radius: ${BorderRadius.xs};
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`

export const KPhraseKeyword = styled.span`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  color: ${Colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const KPhraseText = styled.p`
  font-size: ${FontSize.sm};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
  flex: 1;
`

export const KPhraseRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.sm};
`

export const KPhraseContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xs};
`

export const CopyBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${Spacing.xs};
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: ${BorderRadius.xs};
  color: ${Colors.primary};
  font-size: ${FontSize.xxs};
  font-family: ${FontFamily.body};
  font-weight: ${FontWeight.medium};
  padding: ${Spacing.xs} ${Spacing.sm};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(124, 58, 237, 0.3);
    color: ${Colors.white};
  }
`

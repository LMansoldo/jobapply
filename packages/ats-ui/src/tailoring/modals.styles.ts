import styled from '@emotion/styled'

// Modal shell styles shared by the ATS suggestion modals (Tips, SemanticGaps,
// KeywordPhrases, Phrases, RemoveSuggestions). Ported from the app's
// TailoringEditorPanel.styles.ts — token values now come from props.theme.

export const PhrasesModalBody = styled.div`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
`

export const PhrasesModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const PulseDot = styled.span`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: ${({ theme }) => theme.radius.avatar};
  background: ${({ theme }) => theme.colors.primaryDark};
  flex-shrink: 0;
  animation: pulse 2s infinite;
`

export const PhrasesModalTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`

export const PhraseList = styled.div`
  max-height: 40rem;
  overflow-y: auto;
`

export const PhraseItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.surfaceEditorBorder};
  border-radius: ${({ theme }) => theme.radius.xs};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`

export const PhraseCheckbox = styled.input`
  width: 1.6rem;
  height: 1.6rem;
  margin-top: 0.2rem;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  flex-shrink: 0;
`

export const PhraseComparison = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

export const PhraseFrom = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(239, 68, 68, 0.8);
  background: rgba(239, 68, 68, 0.1);
  text-decoration: line-through;
  text-decoration-color: rgba(239, 68, 68, 0.9);
  text-decoration-thickness: 2px;
  padding: 0.2rem ${({ theme }) => theme.spacing.xs};
  border-radius: 2px;
  word-break: break-word;
`

export const PhraseArrow = styled.span`
  color: rgba(255, 255, 255, 0.3);
  font-size: ${({ theme }) => theme.typography.size.xs};
  flex-shrink: 0;
`

export const PhraseTo = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(34, 197, 94, 0.95);
  background: rgba(34, 197, 94, 0.12);
  padding: 0.2rem ${({ theme }) => theme.spacing.xs};
  border-radius: 2px;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  word-break: break-word;
`

export const PhrasesModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceEditorBorder};
`

export const ModalCloseBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.surfaceEditorBorder};
  border-radius: ${({ theme }) => theme.radius.xs};
  color: rgba(255, 255, 255, 0.65);
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-family: ${({ theme }) => theme.typography.family.body};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const ModalConfirmBtn = styled.button`
  background: rgba(124, 58, 237, 0.25);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: ${({ theme }) => theme.radius.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(124, 58, 237, 0.4);
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

export const EmptyStateDiv = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.7;
  font-size: ${({ theme }) => theme.typography.size.sm};
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
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ priority }) => PRIORITY_BG[priority] ?? PRIORITY_BG.medium};
  border: 1px solid ${({ priority }) => PRIORITY_BORDER[priority] ?? PRIORITY_BORDER.medium};
  border-radius: ${({ theme }) => theme.radius.xs};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PriorityBadge = styled.span<{ priority: string }>`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ priority }) => PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.medium};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
`

export const TipText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
`

export const TipPlatforms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxs};
  margin-top: ${({ theme }) => theme.spacing.xxs};
`

export const PlatformTag = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.xs};
  padding: 0.1rem ${({ theme }) => theme.spacing.xs};
`

// For RemoveSuggestionsModal
export const RemoveItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.radius.xs};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RemoveItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const SectionBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: rgba(239, 68, 68, 0.9);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${({ theme }) => theme.radius.xs};
  padding: 0.1rem ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const RemoveItemText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255, 255, 255, 0.85);
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  margin: 0;
  line-height: 1.4;
`

export const RemoveReasonText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
`

// For SemanticGapsModal
export const GapItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: ${({ theme }) => theme.radius.xs};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`

// For KeywordPhrasesModal
export const KPhraseItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.surfaceEditorBorder};
  border-radius: ${({ theme }) => theme.radius.xs};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const KPhraseKeyword = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const KPhraseText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
  flex: 1;
`

export const KPhraseRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const KPhraseContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const CopyBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: ${({ theme }) => theme.radius.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(124, 58, 237, 0.3);
    color: ${({ theme }) => theme.colors.white};
  }
`

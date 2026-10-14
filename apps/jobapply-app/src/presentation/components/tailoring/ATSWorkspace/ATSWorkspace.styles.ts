import styled from '@emotion/styled'

export const AtsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 25vw;
  grid-template-rows: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 1rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    overflow: visible;
    min-height: auto;
    height: auto;
  }
`

export const AtsCenter = styled.div`
  background: ${({ theme }) => theme.colors.surfacePage};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 768px) {
    overflow: visible;
    min-height: auto;
    height: auto;
    border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: ${({ theme }) => theme.radius.md};
  }
`

export const SuggestionBannerPad = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  flex-shrink: 0;
`

export const SuggestionCard = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

export const SuggestionCardModal = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

export const SuggestionCardIcon = styled.span`
  font-size: 1.4rem;
  line-height: 2rem;
  flex-shrink: 0;
`

export const SuggestionCardText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(124, 58, 237, 0.9);
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.5;
  flex: 1;
`

export const KeywordsArea = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-y: scroll;
  max-height: 15vh;
`

export const KeywordsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`

export const KeywordsLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: rgba(255, 255, 255, 0.45);
  font-family: ${({ theme }) => theme.typography.family.mono};
  flex-shrink: 0;
`

export const KeywordChipAdd = styled.button`
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 4px;
  color: rgba(239, 68, 68, 0.85);
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-family: ${({ theme }) => theme.typography.family.mono};
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
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-family: ${({ theme }) => theme.typography.family.mono};
  padding: 2px 8px;
  cursor: pointer;
  line-height: 1.6;

  &:hover {
    background: rgba(245, 158, 11, 0.22);
  }
`

export const TailoringSpinWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

export const ModalContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
`

export const SuggestionsButtonWrapper = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  display: flex;
  justify-content: center;
`

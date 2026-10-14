import styled from '@emotion/styled'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 28rem;
  gap: 0;
  height: 100%;
  min-height: 40rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const MainPane = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`

export const PreviewBox = styled.pre`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMain};
  white-space: pre-wrap;
  overflow-y: auto;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  text-align: center;
`

export const EmptyDescription = styled.p`
  margin: 0;
  max-width: 40rem;
  line-height: 1.7;
`

export const SidePane = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfacePage};

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  }
`

export const AiCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.base};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const AiCardTitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.typography.family.heading};
`

export const AiCardDesc = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.6;
`

export const GenerateBtn = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const ActionBtn = styled.button`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
  border-radius: ${({ theme }) => theme.radius.full};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
  }
`

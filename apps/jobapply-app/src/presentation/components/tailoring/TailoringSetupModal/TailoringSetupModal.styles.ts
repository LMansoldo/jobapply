import styled from '@emotion/styled'

export const SetupSteps = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const SetupStepDot = styled.div<{ $active?: boolean }>`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  flex-shrink: 0;
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.surfaceBorder)};
  color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.textSub)};
  transition: background 0.2s;
`

export const SetupStepLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${({ theme }) => theme.colors.surfaceBorder};
`

export const SetupStepLabel = styled.span<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  font-weight: ${({ theme, $active }) => ($active ? theme.typography.weight.semibold : theme.typography.weight.regular)};
  flex-shrink: 0;
`

export const SetupSectionTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`

export const SetupLocaleRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`

export const SetupLocaleBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.surfaceBorder)};
  border-radius: ${({ theme }) => theme.radius.base};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : theme.colors.white)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textMain)};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryDark};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

export const SetupTip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const SetupTipText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.orange};
  line-height: 1.5;
  margin: 0;
`

export const SetupJdTextarea = styled.textarea`
  width: 100%;
  min-height: 22rem;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMain};
  outline: none;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }
`

export const SetupModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

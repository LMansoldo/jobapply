import styled from '@emotion/styled'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`

export const StepCounter = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
`

export const ProgressBar = styled.div`
  height: 0.3rem;
  background: ${({ theme }) => theme.colors.surfaceBorder};
  width: 100%;
`

export const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  background: ${({ theme }) => theme.colors.primaryDark};
  transition: width 0.3s ease;
`

export const StepDots = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Dot = styled.span<{ $state: 'todo' | 'active' | 'done' }>`
  width: 0.6rem;
  height: 0.6rem;
  background: ${({ theme, $state }) =>
    $state === 'done' ? theme.colors.primaryMid : $state === 'active' ? theme.colors.primaryDark : theme.colors.surfaceBorder};
`

export const LinkedinLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.socialLinkedin};
`

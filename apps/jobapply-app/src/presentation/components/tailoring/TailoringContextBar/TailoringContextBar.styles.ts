import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

export const ContextBar = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  }
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: ${({ theme }) => theme.spacing.headerHeight};
  font-family: ${({ theme }) => theme.typography.family.body};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    flex-basis: 100%;
  }
`

export const ContextDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 2rem;
  background: ${({ theme }) => theme.colors.surfaceBorder};
`

export const JobRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    flex-basis: 100%;
    justify-content: space-between;
  }
`

export const AnalysisStatus = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const ScoreBadgeWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    display: flex;
    align-items: center;
  }
`

export const AnalysisDot = styled.span<{ $running?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $running }) => ($running ? theme.colors.orange : theme.colors.success)};
  flex-shrink: 0;
  ${({ $running }) => $running && `animation: ${pulse} 1.2s ease-in-out infinite;`}
`

export const AnalysisLabel = styled.span<{ $running?: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme, $running }) => ($running ? theme.colors.orange : theme.colors.success)};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`

export const ManualModeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`

export const ManualModeTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
`

export const ManualModeDesc = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textSub};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

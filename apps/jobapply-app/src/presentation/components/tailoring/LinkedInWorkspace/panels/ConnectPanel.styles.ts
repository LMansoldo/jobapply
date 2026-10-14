import styled from '@emotion/styled'
import { LinkedinOutlined } from '@ant-design/icons'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  min-height: 40rem;

  ${({ theme }) => theme.mediaQueries.tabletDown} {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  max-width: 44rem;
  width: 100%;
`

export const LinkedinIcon = styled(LinkedinOutlined)`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.socialLinkedin};
`

export const Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.heading};
  color: ${({ theme }) => theme.colors.textMain};
  text-align: center;
`

export const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  text-align: center;
`

export const ConnectedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
`

export const ConnectBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.socialLinkedin};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  justify-content: center;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`

export const AnalyzeBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  justify-content: center;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`

export const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  }

  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.typography.family.body};
`

export const PdfBtn = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`

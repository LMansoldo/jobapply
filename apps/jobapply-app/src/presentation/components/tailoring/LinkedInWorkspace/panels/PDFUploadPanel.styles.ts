import styled from '@emotion/styled'
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons'

export const Root = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.lg}`};
  min-height: 40rem;
`

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 52rem;
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
`

export const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const Tutorial = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
`

export const TutorialTitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.primaryDark};
`

export const Steps = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const Step = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`

export const StepNumber = styled.span`
  flex-shrink: 0;
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const StepTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textMain};
`

export const StepDesc = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textSub};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const Dropzone = styled.div<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.primaryMid)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryMid : theme.colors.white)};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

export const DropIcon = styled(InboxOutlined)`
  font-size: 3.2rem;
  color: ${({ theme }) => theme.colors.primaryDark};
`

export const DropText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

export const HiddenInput = styled.input`
  display: none;
`

export const FileChosen = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.successBg};
  border: 1px solid ${({ theme }) => theme.colors.success};
  width: 100%;
`

export const FileSuccessIcon = styled(CheckCircleOutlined)`
  color: ${({ theme }) => theme.colors.success};
  flex-shrink: 0;
`

export const FileName = styled.p`
  flex: 1;
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: ${({ theme }) => theme.typography.family.body};
  color: ${({ theme }) => theme.colors.textMain};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const AnalyzeBtn = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} 0`};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border: none;
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

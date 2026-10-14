import styled from '@emotion/styled'
import { Link } from '@tanstack/react-router'
import { FormItem } from '../../../design-system/wrappers/Form'
import { Divider } from '../../../design-system/wrappers/Divider'

export const LeftPanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const LeftHeadline = styled.h1`
  font-family: ${({ theme }) => theme.typography.family.heading};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.size.h3};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.15;
`

export const LeftSubtitle = styled.p`
  color: rgba(255,255,255,0.65);
  font-size: ${({ theme }) => theme.typography.size.base};
  margin: 0;
  line-height: 1.6;
`

export const LeftFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RightPanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const RightHeadingRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

export const RightTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  color: ${({ theme }) => theme.colors.textMain};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

export const FormItemSpacing = styled(FormItem)`
  &.ant-form-item {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`

export const FormItemSubmit = styled(FormItem)`
  &.ant-form-item {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`

export const FullWidthBtn = styled.div`
  & button {
    width: 100%;
  }
`

export const RightSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.base};
  margin: 0;
`

export const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`

export const SocialBtns = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const DividerOr = styled(Divider)`
  & .ant-divider-inner-text {
    color: ${({ theme }) => theme.colors.textSub};
    font-size: ${({ theme }) => theme.typography.size.sm};
  }
`

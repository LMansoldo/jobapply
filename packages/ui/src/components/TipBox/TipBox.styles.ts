import styled from '@emotion/styled'
import { Alert } from 'antd'

export const StyledAlert = styled(Alert)`
  background: ${({ theme }) => theme.colors.primaryLight};
  border-left: 3px solid ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.md};
`

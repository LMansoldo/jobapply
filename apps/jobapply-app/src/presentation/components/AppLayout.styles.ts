import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Space } from '../../components/Space'
import { Avatar } from '../../components/Avatar'
import { AppContent } from '../../components/Layout'
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'

export const pageRoot = css({
  minHeight: '100vh',
  background: Colors.pageBg,
})

export const UserSpace = styled(Space)`
  cursor: pointer;
`

export const UserAvatar = styled(Avatar)`
  background: ${Colors.primaryDark};
`

export const UserName = styled.span`
  color: ${Colors.textMain};
  font-size: 1.4rem;
`

export const AppContentStyled = styled(AppContent)<{ isMobile: boolean }>`
  padding: 0;
  min-height: calc(100vh - 6.4rem);
`

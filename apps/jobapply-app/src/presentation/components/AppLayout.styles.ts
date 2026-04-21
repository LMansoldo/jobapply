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
  padding-bottom: ${({ isMobile }) => (isMobile ? '6.4rem' : '0')};
`

export const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 6.4rem;
  background: ${Colors.white};
  border-top: 1px solid ${Colors.border ?? '#e8e8e8'};
  display: flex;
  align-items: stretch;
`

export const BottomNavItem = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ active }) => (active ? Colors.primaryDark : Colors.textSub)};
  font-size: 1.0rem;
  font-weight: 500;
  padding: ${Spacing.xs} 0;
  transition: color 0.15s;

  svg {
    font-size: 2.0rem;
  }
`

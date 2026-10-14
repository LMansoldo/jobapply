import styled from '@emotion/styled'
import { Space } from '../../design-system/wrappers/Space'
import { Avatar } from '../../design-system/wrappers/Avatar'
import { AppContent } from '../../design-system/wrappers/Layout'

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.pageBg};
`

export const UserSpace = styled(Space)`
  cursor: pointer;
`

export const UserAvatar = styled(Avatar)`
  background: ${({ theme }) => theme.colors.primaryDark};
`

export const UserName = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
  font-size: 1.4rem;
`

export const AppContentStyled = styled(AppContent)<{ $isMobile: boolean }>`
  padding: 0;
  min-height: calc(100vh - 6.4rem);
  padding-bottom: ${({ $isMobile }) => ($isMobile ? '6.4rem' : '0')};
`

export const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 6.4rem;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border ?? '#e8e8e8'};
  display: flex;
  align-items: stretch;
`

export const BottomNavItem = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  font-size: 1.0rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  transition: color 0.15s;

  svg {
    font-size: 2.0rem;
  }
`

import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 6.4rem;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`

export const Logo = styled.a`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 2rem;
  text-decoration: none;
  margin-right: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  letter-spacing: -0.5px;
`

export const LogoJob = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
`

export const LogoBoard = styled.span`
  color: ${Colors.primaryMid};
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`

export const NavLink = styled.a<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-size: 1.1rem;
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : 'transparent')};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.sm2} ${theme.spacing.sm}`};
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  border: none;
  min-width: 5.6rem;
  letter-spacing: 0.2px;
`

export const NavLinkButton = styled.button<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-size: 1.1rem;
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : 'transparent')};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.sm2} ${theme.spacing.sm}`};
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  border: none;
  min-width: 5.6rem;
  letter-spacing: 0.2px;
`

export const NavIcon = styled.span`
  font-size: 1.7rem;
  line-height: 1;
`

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

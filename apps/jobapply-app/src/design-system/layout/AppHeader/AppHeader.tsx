import type { AppHeaderProps } from './AppHeader.types'
import { Header, Logo, LogoJob, LogoBoard, Nav, NavLink, NavLinkButton, NavIcon, Right } from './AppHeader.styles'

export function AppHeader({ navItems = [], rightSlot }: AppHeaderProps) {
  return (
    <Header>
      <Logo href="/tailoring">
        <LogoJob>do</LogoJob>
        <LogoBoard>job</LogoBoard>
      </Logo>

      {navItems.length > 0 && (
        <Nav>
          {navItems.map((item) =>
            item.href ? (
              <NavLink key={item.key} href={item.href} $active={!!item.active}>
                {item.icon && <NavIcon>{item.icon}</NavIcon>}
                {item.label}
              </NavLink>
            ) : (
              <NavLinkButton key={item.key} type="button" onClick={item.onClick} $active={!!item.active}>
                {item.icon && <NavIcon>{item.icon}</NavIcon>}
                {item.label}
              </NavLinkButton>
            ),
          )}
        </Nav>
      )}

      <Right>
        {rightSlot}
      </Right>
    </Header>
  )
}

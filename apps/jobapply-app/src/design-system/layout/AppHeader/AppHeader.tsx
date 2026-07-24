import type { AppHeaderProps } from './AppHeader.types'
import { styles } from './AppHeader.styles'

export function AppHeader({ navItems = [], rightSlot }: AppHeaderProps) {
  return (
    <header style={styles.header}>
      <a href="/tailoring" style={styles.logo}>
        <span style={styles.logoJob}>do</span>
        <span style={styles.logoBoard}>job</span>
      </a>

      {navItems.length > 0 && (
        <nav style={styles.nav}>
          {navItems.map((item) =>
            item.href ? (
              <a
                key={item.key}
                href={item.href}
                style={{
                  ...styles.navLink,
                  ...(item.active ? styles.navLinkActive : {}),
                }}
              >
                {item.icon && <span style={styles.navIcon}>{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                style={{
                  ...styles.navLink,
                  ...(item.active ? styles.navLinkActive : {}),
                }}
              >
                {item.icon && <span style={styles.navIcon}>{item.icon}</span>}
                {item.label}
              </button>
            ),
          )}
        </nav>
      )}

      <div style={styles.right}>
        {rightSlot}
      </div>
    </header>
  )
}

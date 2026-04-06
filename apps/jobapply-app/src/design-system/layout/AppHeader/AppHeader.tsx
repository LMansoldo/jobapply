import { useTranslation } from 'react-i18next'
import type { AppHeaderProps } from './AppHeader.types'
import { styles } from './AppHeader.styles'

export function AppHeader({ navItems = [], rightSlot, logoText }: AppHeaderProps) {
  const { t } = useTranslation()

  return (
    <header style={styles.header}>
      <a href="/" style={styles.logo}>
        {logoText ?? t('app.name')}
      </a>
      {navItems.length > 0 && (
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href ?? '#'}
              style={{
                ...styles.navLink,
                ...(item.active ? styles.navLinkActive : {}),
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
      <div style={styles.right}>{rightSlot}</div>
    </header>
  )
}

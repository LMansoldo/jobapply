import { useTranslation } from 'react-i18next'
import type { AppHeaderProps } from './AppHeader.types'
import { styles } from './AppHeader.styles'

export function AppHeader({ navItems = [], rightSlot, onPublishJob }: AppHeaderProps) {
  const { t } = useTranslation()

  return (
    <header style={styles.header}>
      <a href="/" style={styles.logo}>
        <span style={styles.logoJob}>job</span>
        <span style={styles.logoBoard}>board</span>
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
        <button type="button" style={styles.publishBtn} onClick={onPublishJob}>
          {t('nav.publishJob')}
        </button>
        {rightSlot}
      </div>
    </header>
  )
}

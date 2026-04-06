import type { AuthLayoutProps } from './AuthLayout.types'
import { styles } from './AuthLayout.styles'

export function AuthLayout({ left, right }: AuthLayoutProps) {
  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>{left}</div>
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>{right}</div>
      </div>
    </div>
  )
}

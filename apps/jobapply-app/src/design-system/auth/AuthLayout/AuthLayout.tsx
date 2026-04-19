import type { AuthLayoutProps } from './AuthLayout.types'
import * as styles from './AuthLayout.styles'

export function AuthLayout({ left, right }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>{left}</div>
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>{right}</div>
      </div>
    </div>
  )
}

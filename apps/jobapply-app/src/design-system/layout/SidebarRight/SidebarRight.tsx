import type { SidebarRightProps } from './SidebarRight.types'
import { styles } from './SidebarRight.styles'

export function SidebarRight({ children }: SidebarRightProps) {
  return <aside style={styles.sidebar}>{children}</aside>
}

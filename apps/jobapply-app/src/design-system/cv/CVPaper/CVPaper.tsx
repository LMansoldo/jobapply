import type { CVPaperProps } from './CVPaper.types'
import { styles } from './CVPaper.styles'

export function CVPaper({ children }: CVPaperProps) {
  return <div style={styles.paper}>{children}</div>
}

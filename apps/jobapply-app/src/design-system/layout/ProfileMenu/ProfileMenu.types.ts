import type { ReactNode } from 'react'
import type { User } from '../../../domain/auth/types'

export interface ProfileMenuProps {
  user: User
  isMobile?: boolean
  onLogout: () => void
  onViewProfile?: () => void
}

export interface ProfileMenuPanelProps {
  user: User
  completionPercent: number
  onLogout: () => void
  onViewProfile?: () => void
  /** Render prop: custom footer slot */
  renderFooter?: () => ReactNode
}

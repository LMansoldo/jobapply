import type { ReactNode } from 'react'
import type { User } from '../../../domain/auth/types'

export interface JobAlert {
  icon: string
  title: string
  subtitle: string
  count: number
}

export interface ProfileMenuProps {
  user: User
  alerts?: JobAlert[]
  isMobile?: boolean
  onLogout: () => void
  onViewProfile?: () => void
}

export interface ProfileMenuPanelProps {
  user: User
  alerts: JobAlert[]
  completionPercent: number
  onLogout: () => void
  onViewProfile?: () => void
  /** Render prop: custom footer slot below the alert list */
  renderFooter?: () => ReactNode
}

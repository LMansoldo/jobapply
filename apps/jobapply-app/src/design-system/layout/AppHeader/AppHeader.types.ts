import type { ReactNode } from 'react'

export interface NavItem {
  key: string
  label: string
  icon?: ReactNode
  href?: string
  active?: boolean
  onClick?: () => void
}

export interface AppHeaderProps {
  navItems?: NavItem[]
  rightSlot?: ReactNode
  logoText?: string
  onPublishJob?: () => void
}

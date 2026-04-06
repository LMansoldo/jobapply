import type { ReactNode } from 'react'

export interface NavItem {
  key: string
  label: string
  href?: string
  active?: boolean
}

export interface AppHeaderProps {
  navItems?: NavItem[]
  rightSlot?: ReactNode
  logoText?: string
}

import type { ReactNode } from 'react'

export interface RoleOption {
  key: string
  label: string
  icon: ReactNode
}

export interface RoleCardsProps {
  roles: RoleOption[]
  value: string
  onChange: (key: string) => void
}

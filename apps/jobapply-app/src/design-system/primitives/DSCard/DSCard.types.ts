import type { ReactNode } from 'react'

export interface DSCardProps {
  title?: ReactNode
  extra?: ReactNode
  children: ReactNode
  hoverable?: boolean
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

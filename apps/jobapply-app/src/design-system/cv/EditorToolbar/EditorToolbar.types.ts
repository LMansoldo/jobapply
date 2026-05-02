import type { ReactNode } from 'react'

export interface ToolbarItem {
  key: string
  icon: ReactNode
  label?: string
  active?: boolean
  wide?: boolean
  group?: string
}

export interface EditorToolbarProps {
  items: ToolbarItem[]
  onAction: (key: string) => void
}

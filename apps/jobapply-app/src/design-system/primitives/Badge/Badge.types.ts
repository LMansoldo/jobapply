export type BadgeVariant = 'hot' | 'new' | 'remote' | 'default'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

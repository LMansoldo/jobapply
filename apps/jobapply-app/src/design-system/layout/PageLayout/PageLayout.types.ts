import type { ReactNode } from 'react'

export type PageLayoutVariant = 'jobs' | 'cv' | 'tailoring' | 'linkedin'

export interface PageLayoutProps {
  left?: ReactNode
  center: ReactNode
  right?: ReactNode
  variant?: PageLayoutVariant
}

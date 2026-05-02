import type { User } from '../../../domain/auth/types'

export interface ProfileCardProps {
  user: User
  completionPercent: number
}

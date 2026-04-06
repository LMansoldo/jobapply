import type { InputProps } from '../../../components/Input/Input.types'
import type { ReactNode } from 'react'

export interface DSInputProps extends InputProps {
  filled?: boolean
  leftIcon?: ReactNode
}

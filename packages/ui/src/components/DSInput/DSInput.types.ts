import type { InputProps } from 'antd'
import type { ReactNode } from 'react'

export interface DSInputProps extends InputProps {
  filled?: boolean
  leftIcon?: ReactNode
}

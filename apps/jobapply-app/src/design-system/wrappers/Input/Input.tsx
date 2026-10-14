/**
 * @file Input.tsx
 * @description Wrapper around Ant Design Input and Input.Password. Provides a single import point for the project.
 */
import { Input as AntInput } from 'antd'
import type { InputProps, InputPasswordProps } from './Input.types'

/**
 * Wrapper around Ant Design Input.
 * @param props - InputProps forwarded to AntInput
 */
export function Input(props: InputProps) {
  return <AntInput {...props} />
}

/**
 * Wrapper around Ant Design Input.Password.
 * @param props - InputPasswordProps forwarded to AntInput.Password
 */
export function InputPassword(props: InputPasswordProps) {
  return <AntInput.Password {...props} />
}

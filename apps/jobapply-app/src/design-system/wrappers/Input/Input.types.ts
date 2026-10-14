/**
 * @file Input.types.ts
 * @description Type definitions for the Input and InputPassword wrapper components.
 */
import type { InputProps as AntInputProps } from 'antd'
import { Input } from 'antd'
import type React from 'react'

/** Props for the Input wrapper. Extends Ant Design InputProps. */
export interface InputProps extends AntInputProps {}

/** Props for the InputPassword wrapper. */
export type InputPasswordProps = React.ComponentProps<typeof Input.Password>

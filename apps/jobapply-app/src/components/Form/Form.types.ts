/**
 * @file Form.types.ts
 * @description Type definitions for the Form and FormItem wrapper components.
 */
import type { FormProps as AntFormProps } from 'antd'
import { Form } from 'antd'
import type { ReactNode } from 'react'

/**
 * Props for the Form wrapper.
 * Overrides children to ReactNode to satisfy JSX type constraints.
 */
export type FormProps = Omit<AntFormProps, 'children'> & {
  /** Form content */
  children?: ReactNode
}

/** Props for the FormItem wrapper. Uses ComponentProps to capture the full type. */
export type FormItemProps = React.ComponentProps<typeof Form.Item>

/**
 * @file Form.tsx
 * @description Wrappers around Ant Design Form and Form.Item.
 * Provides a single import point for the project.
 */
import { Form as AntForm } from 'antd'
import type { FormProps, FormItemProps } from './Form.types'

/**
 * Wrapper around Ant Design Form.
 * All props are forwarded unchanged to AntForm.
 *
 * @param props - FormProps forwarded to AntForm
 */
export function Form(props: FormProps) {
  return <AntForm {...props} />
}

/** Expose the useForm hook on the wrapper for convenience. */
Form.useForm = AntForm.useForm

/**
 * Wrapper around Ant Design Form.Item.
 * All props are forwarded unchanged to AntForm.Item.
 *
 * @param props - FormItemProps forwarded to AntForm.Item
 */
export function FormItem(props: FormItemProps) {
  return <AntForm.Item {...props} />
}

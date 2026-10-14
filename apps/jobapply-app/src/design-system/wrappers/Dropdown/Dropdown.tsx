/**
 * @file Dropdown.tsx
 * @description Wrapper around Ant Design Dropdown. Provides a single import point for the project.
 */
import { Dropdown as AntDropdown } from 'antd'
import type { DropdownProps } from './Dropdown.types'

/**
 * Wrapper around Ant Design Dropdown.
 * @param props - DropdownProps forwarded to AntDropdown
 */
export function Dropdown({ children, ...props }: DropdownProps) {
  return <AntDropdown {...props}>{children}</AntDropdown>
}

/**
 * @file Pagination.tsx
 * @description Wrapper around Ant Design Pagination. Provides a single import point for the project.
 */
import { Pagination as AntPagination } from 'antd'
import type { PaginationProps } from './Pagination.types'

/**
 * Wrapper around Ant Design Pagination.
 * @param props - PaginationProps forwarded to AntPagination
 */
export function Pagination(props: PaginationProps) {
  return <AntPagination {...props} />
}

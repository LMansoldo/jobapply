import type { PaginationProps } from '../../../components/Pagination/Pagination.types'

export interface DSPaginationProps extends Omit<PaginationProps, 'onChange'> {
  onChange?: (page: number) => void
}

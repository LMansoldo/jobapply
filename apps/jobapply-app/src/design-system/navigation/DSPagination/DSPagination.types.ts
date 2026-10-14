import type { PaginationProps } from '../../wrappers/Pagination/Pagination.types'

export interface DSPaginationProps extends Omit<PaginationProps, 'onChange'> {
  onChange?: (page: number) => void
}

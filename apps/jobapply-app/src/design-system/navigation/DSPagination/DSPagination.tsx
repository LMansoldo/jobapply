import { Pagination } from '../../../components/Pagination'
import type { DSPaginationProps } from './DSPagination.types'
import { PaginationContainer } from './DSPagination.styles'

export function DSPagination({ onChange, ...props }: DSPaginationProps) {
  const handleChange = (page: number, _pageSize: number) => {
    onChange?.(page)
  }

  // Custom itemRender to hide jump-prev and jump-next items ("...")
  const itemRender = (
    _page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode
  ) => {
    // Hide jump-prev and jump-next items (the "..." ellipsis)
    if (type === 'jump-prev' || type === 'jump-next') {
      return null
    }
    return element
  }

  return (
    <PaginationContainer>
      <Pagination
        {...props}
        onChange={handleChange}
        showLessItems
        itemRender={itemRender}
      />
    </PaginationContainer>
  )
}

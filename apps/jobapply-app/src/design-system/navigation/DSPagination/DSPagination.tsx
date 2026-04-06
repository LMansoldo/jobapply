import { Pagination } from '../../../components/Pagination'
import type { DSPaginationProps } from './DSPagination.types'
import { styles } from './DSPagination.styles'

export function DSPagination(props: DSPaginationProps) {
  return (
    <div style={styles.wrapper}>
      <Pagination {...props} />
    </div>
  )
}

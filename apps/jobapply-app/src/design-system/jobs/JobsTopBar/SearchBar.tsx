/** Presentational: controlled search input for the jobs filter bar. */
import { SearchOutlined } from '@ant-design/icons'
import { Input } from '../../../components/Input'
import type { SearchBarProps } from './JobsTopBar.types'
import * as styles from './JobsTopBar.styles'

export function SearchBar({ value, onChange, placeholder = 'Buscar vagas...' }: SearchBarProps) {
  return (
    <div className={styles.searchWrapper}>
      <Input
        prefix={<SearchOutlined className={styles.searchIcon} />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        allowClear
      />
    </div>
  )
}

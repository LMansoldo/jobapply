/** Presentational: compact global search input for the app header. */
import { SearchOutlined } from '@ant-design/icons'
import { Input } from '../../../components/Input'
import type { NavSearchInputProps } from './NavSearchInput.types'
import * as S from './NavSearchInput.styles'

export function NavSearchInput({ value, onChange, placeholder }: NavSearchInputProps) {
  return (
    <S.Wrapper>
      <Input
        prefix={<SearchOutlined className={S.prefixIcon} />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        allowClear
      />
    </S.Wrapper>
  )
}

/** Presentational: compact global search input for the app header. */
import { Input } from '../../wrappers/Input'
import type { NavSearchInputProps } from './NavSearchInput.types'
import { Wrapper, PrefixIcon } from './NavSearchInput.styles'

export function NavSearchInput({ value, onChange, placeholder }: NavSearchInputProps) {
  return (
    <Wrapper>
      <Input
        prefix={<PrefixIcon />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        allowClear
      />
    </Wrapper>
  )
}

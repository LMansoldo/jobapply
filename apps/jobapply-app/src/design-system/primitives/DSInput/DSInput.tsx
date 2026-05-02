import { Input } from '../../../components/Input'
import type { DSInputProps } from './DSInput.types'
import { styles } from './DSInput.styles'

export function DSInput({ filled, leftIcon, style, ...rest }: DSInputProps) {
  const inputStyle = {
    ...styles.inputBase,
    ...(filled ? styles.inputFilled : {}),
    ...(leftIcon ? { paddingLeft: '3.6rem' } : {}),
    ...style,
  }

  if (leftIcon) {
    return (
      <div style={styles.wrapper}>
        <span style={styles.iconWrapper}>{leftIcon}</span>
        <Input style={inputStyle} {...rest} />
      </div>
    )
  }

  return <Input style={inputStyle} {...rest} />
}

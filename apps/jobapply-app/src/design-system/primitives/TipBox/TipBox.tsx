import { Alert } from '../../../components/Alert'
import type { TipBoxProps } from './TipBox.types'
import { styles } from './TipBox.styles'

export function TipBox({ message, description }: TipBoxProps) {
  return (
    <Alert
      type="info"
      showIcon
      message={message}
      description={description}
      style={styles.wrapper}
    />
  )
}

import type { TipBoxProps } from './TipBox.types'
import { StyledAlert } from './TipBox.styles'

export function TipBox({ message, description }: TipBoxProps) {
  return (
    <StyledAlert type="info" showIcon message={message} description={description} />
  )
}

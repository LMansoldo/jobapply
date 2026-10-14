import type { DSCardProps } from './DSCard.types'
import { CardHeader, CardTitle, StyledCard } from './DSCard.styles'

export function DSCard({ title, extra, children, hoverable, style, className, onClick }: DSCardProps) {
  return (
    <StyledCard className={className} style={style} onClick={onClick} $hoverable={hoverable}>
      {(title || extra) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {extra}
        </CardHeader>
      )}
      {children}
    </StyledCard>
  )
}

/**
 * @file Card.tsx
 * @description Wrapper around Ant Design Card. Provides a single import point for the project.
 */
import { Card as AntCard } from 'antd'
import type { CardProps } from './Card.types'

/**
 * Wrapper around Ant Design Card.
 * @param props - CardProps forwarded to AntCard
 */
export function Card({ children, ...props }: CardProps) {
  return <AntCard {...props}>{children}</AntCard>
}

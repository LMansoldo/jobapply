/**
 * @file Modal.tsx
 * @description Wrapper around Ant Design Modal. Provides a single import point for the project.
 */
import React from 'react'
import { Modal as AntModal } from 'antd'
import type { ModalProps } from './Modal.types'

/**
 * Wrapper around Ant Design Modal.
 * @param props - ModalProps forwarded to AntModal
 */
const SQUARE_CONTENT: React.CSSProperties = { borderRadius: 0 }

export function Modal({ children, styles, ...props }: ModalProps) {
  return (
    <AntModal styles={{ content: SQUARE_CONTENT, ...styles }} {...props}>
      {children}
    </AntModal>
  )
}

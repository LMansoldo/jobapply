/**
 * @file Modal.tsx
 * @description Wrapper around Ant Design Modal. Provides a single import point for the project.
 */
import { Modal as AntModal } from 'antd'
import type { ModalProps } from './Modal.types'

/**
 * Wrapper around Ant Design Modal.
 * @param props - ModalProps forwarded to AntModal
 */
export function Modal({ children, ...props }: ModalProps) {
  return <AntModal {...props}>{children}</AntModal>
}

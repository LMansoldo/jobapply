import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Modal } from '../../../components/Modal'
import * as S from './CVPreviewModal.styles'

interface CVPreviewModalProps {
  open: boolean
  markdownContent: string
  onClose: () => void
}

export function CVPreviewModal({ open, markdownContent, onClose }: CVPreviewModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('tailoring.previewCV')}
      footer={null}
      width={800}
    >
      <S.MarkdownWrapper>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
      </S.MarkdownWrapper>
    </Modal>
  )
}

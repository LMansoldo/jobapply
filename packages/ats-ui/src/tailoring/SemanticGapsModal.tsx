import { useTranslation } from 'react-i18next'
import { useTheme } from '@emotion/react'
import { Modal } from 'antd'
import * as S from './modals.styles'

interface SemanticGapsModalProps {
  open: boolean
  onClose: () => void
  gaps?: string[]
}

export function SemanticGapsModal({ open, onClose, gaps = [] }: SemanticGapsModalProps) {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width={640}
      styles={{
        body: { background: 'transparent', padding: 0, margin: 0 },
        content: {
          background: theme.colors.surfaceEditor,
          border: `1px solid ${theme.colors.surfaceEditorBorder}`,
          borderRadius: theme.radius.none,
        },
      }}
    >
      <S.PhrasesModalBody>
        <S.PhrasesModalHeader>
          <S.PulseDot />
          <S.PhrasesModalTitle>{t('tailoring.semanticGaps')}</S.PhrasesModalTitle>
        </S.PhrasesModalHeader>

        <S.PhraseList>
          {gaps.length > 0 ? (
            gaps.map((gap, index) => (
              <S.GapItem key={index}>{gap}</S.GapItem>
            ))
          ) : (
            <S.EmptyStateDiv>{t('tailoring.noSemanticGaps')}</S.EmptyStateDiv>
          )}
        </S.PhraseList>

        <S.PhrasesModalFooter>
          <S.ModalCloseBtn onClick={onClose}>{t('common.cancel')}</S.ModalCloseBtn>
        </S.PhrasesModalFooter>
      </S.PhrasesModalBody>
    </Modal>
  )
}

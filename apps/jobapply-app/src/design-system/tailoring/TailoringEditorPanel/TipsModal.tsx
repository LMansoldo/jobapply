import { useTranslation } from 'react-i18next'
import { Modal } from '../../../components/Modal'
import type { ATSTip } from './TailoringEditorPanel.types'
import * as S from './TailoringEditorPanel.styles'

const PRIORITY_LABEL_KEY: Record<string, string> = {
  critical: 'tailoring.priorityCritical',
  high: 'tailoring.priorityHigh',
  medium: 'tailoring.priorityMedium',
  low: 'tailoring.priorityLow',
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

interface TipsModalProps {
  open: boolean
  onClose: () => void
  tips?: ATSTip[]
}

export function TipsModal({ open, onClose, tips = [] }: TipsModalProps) {
  const { t } = useTranslation()

  const sorted = [...tips].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width={680}
      styles={{
        body: { background: 'transparent', padding: 0, margin: 0 },
        content: {
          background: S.Colors.surfaceEditor,
          border: `1px solid ${S.Colors.surfaceEditorBorder}`,
          borderRadius: S.BorderRadius.none,
        },
      }}
    >
      <S.PhrasesModalBody>
        <S.PhrasesModalHeader>
          <S.PulseDot />
          <S.PhrasesModalTitle>{t('tailoring.atsTips')}</S.PhrasesModalTitle>
        </S.PhrasesModalHeader>

        <S.PhraseList>
          {sorted.length > 0 ? (
            sorted.map((tip, index) => (
              <S.TipItem key={index} priority={tip.priority}>
                <S.TipHeader>
                  <S.PriorityBadge priority={tip.priority}>
                    {t(PRIORITY_LABEL_KEY[tip.priority] ?? 'tailoring.priorityMedium')}
                  </S.PriorityBadge>
                </S.TipHeader>
                <S.TipText>{tip.tip}</S.TipText>
                {tip.applicableTo && tip.applicableTo.length > 0 && (
                  <S.TipPlatforms>
                    {tip.applicableTo.map((platform) => (
                      <S.PlatformTag key={platform}>{platform}</S.PlatformTag>
                    ))}
                  </S.TipPlatforms>
                )}
              </S.TipItem>
            ))
          ) : (
            <S.EmptyStateDiv>{t('tailoring.noAtsTips')}</S.EmptyStateDiv>
          )}
        </S.PhraseList>

        <S.PhrasesModalFooter>
          <S.ModalCloseBtn onClick={onClose}>{t('common.cancel')}</S.ModalCloseBtn>
        </S.PhrasesModalFooter>
      </S.PhrasesModalBody>
    </Modal>
  )
}

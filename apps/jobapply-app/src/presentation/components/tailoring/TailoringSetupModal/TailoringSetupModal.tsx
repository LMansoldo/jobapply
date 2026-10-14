import { useTranslation } from 'react-i18next'
import { BulbOutlined } from '@ant-design/icons'
import { Modal } from '../../../../design-system/wrappers/Modal'
import { Button } from '../../../../design-system/wrappers/Button'
import type { TailoringSetupModalProps } from './TailoringSetupModal.types'
import * as S from './TailoringSetupModal.styles'

export function TailoringSetupModal({
  open,
  step,
  locales,
  selectedLocale,
  jobDescription,
  onLocaleChange,
  onJobDescriptionChange,
  onStepChange,
  onConfirm,
  onCancel,
}: TailoringSetupModalProps) {
  const { t } = useTranslation()

  const totalSteps = locales.length > 1 ? 2 : 1

  return (
    <Modal
      open={open}
      title={t('tailoring.setupTitle')}
      footer={null}
      onCancel={() => onCancel({ locale: selectedLocale, jobDescription })}
    >
      {totalSteps > 1 && (
        <S.SetupSteps>
          <S.SetupStepDot $active={step === 1}>1</S.SetupStepDot>
          <S.SetupStepLabel $active={step === 1}>{t('tailoring.setupLocaleTitle')}</S.SetupStepLabel>
          <S.SetupStepLine />
          <S.SetupStepDot $active={step === 2}>2</S.SetupStepDot>
          <S.SetupStepLabel $active={step === 2}>{t('tailoring.setupJdTitle')}</S.SetupStepLabel>
        </S.SetupSteps>
      )}

      {step === 1 && (
        <>
          <S.SetupSectionTitle>
            {locales.length > 1 ? t('tailoring.setupLocaleMultiple') : t('tailoring.setupLocaleSingle')}
          </S.SetupSectionTitle>
          <S.SetupLocaleRow>
            {locales.map((locale) => (
              <S.SetupLocaleBtn
                key={locale}
                type="button"
                $active={selectedLocale === locale}
                onClick={() => onLocaleChange(locale)}
              >
                {locale === 'pt-BR' ? t('tailoring.localePtBr') : t('tailoring.localeEn')}
              </S.SetupLocaleBtn>
            ))}
          </S.SetupLocaleRow>
          <S.SetupModalFooter>
            <span />
            <Button type="primary" onClick={() => onStepChange(2)}>{t('tailoring.setupNext')}</Button>
          </S.SetupModalFooter>
        </>
      )}

      {step === 2 && (
        <>
          <S.SetupTip>
            <BulbOutlined />
            <S.SetupTipText>{t('tailoring.setupJdTip')}</S.SetupTipText>
          </S.SetupTip>

          <S.SetupJdTextarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
          />

          <S.SetupModalFooter>
            {totalSteps > 1
              ? <Button onClick={() => onStepChange(1)}>{t('common.back')}</Button>
              : <span />
            }
            <Button type="primary" onClick={() => onConfirm({ locale: selectedLocale, jobDescription })}>
              {t('tailoring.setupConfirm')}
            </Button>
          </S.SetupModalFooter>
        </>
      )}
    </Modal>
  )
}
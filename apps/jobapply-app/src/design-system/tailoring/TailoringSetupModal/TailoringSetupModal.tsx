import { useTranslation } from 'react-i18next'
import { BulbOutlined } from '@ant-design/icons'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Alert } from '../../../components/Alert'
import type { TailoringSetupModalProps } from './TailoringSetupModal.types'
import * as S from './TailoringSetupModal.styles'

export function TailoringSetupModal({
  open,
  step,
  locales,
  selectedLocale,
  jobDescription,
  job,
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
        <div className={S.setupSteps}>
          <div className={S.setupStepDot(step === 1)}>1</div>
          <span className={S.setupStepLabel(step === 1)}>{t('tailoring.setupLocaleTitle')}</span>
          <div className={S.setupStepLine} />
          <div className={S.setupStepDot(step === 2)}>2</div>
          <span className={S.setupStepLabel(step === 2)}>{t('tailoring.setupJdTitle')}</span>
        </div>
      )}

      {step === 1 && (
        <>
          <p className={S.setupSectionTitle}>
            {locales.length > 1 ? t('tailoring.setupLocaleMultiple') : t('tailoring.setupLocaleSingle')}
          </p>
          <div className={S.setupLocaleRow}>
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                className={S.setupLocaleBtn(selectedLocale === locale)}
                onClick={() => onLocaleChange(locale)}
              >
                {locale === 'pt-BR' ? t('tailoring.localePtBr') : t('tailoring.localeEn')}
              </button>
            ))}
          </div>
          <div className={S.setupModalFooter}>
            <span />
            <Button type="primary" onClick={() => onStepChange(2)}>{t('tailoring.setupNext')}</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className={S.setupTip}>
            <BulbOutlined />
            <p className={S.setupTipText}>{t('tailoring.setupJdTip')}</p>
          </div>

          {!job?.description ? (
            <textarea
              className={S.setupJdTextarea}
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
            />
          ) : (
            <Alert
              message={t('tailoring.setupModal.descriptionLoaded')}
              type="info"
              showIcon
            />
          )}

          <div className={S.setupModalFooter}>
            {totalSteps > 1
              ? <Button onClick={() => onStepChange(1)}>{t('common.back')}</Button>
              : <span />
            }
            <Button type="primary" onClick={() => onConfirm({ locale: selectedLocale, jobDescription })}>
              {t('tailoring.setupConfirm')}
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}
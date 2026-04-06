/**
 * @file CVBaseForm.tsx
 * @description CVBaseForm component — step 0 of the CV wizard: personal info form.
 */
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { CVBaseFormProps } from './CVBaseForm.types'
import { WizardCard } from '../../../../design-system/cv/WizardCard'
import { Form, FormItem } from '../../../../components/Form'
import { Input } from '../../../../components/Input'
import { Select } from '../../../../components/Select'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { Row } from '../../../../components/Row'
import { Col } from '../../../../components/Col'
import { LANGUAGE_OPTIONS } from '../../constants'
import { Spacing } from '../../../../styles/theme/spacing'

/**
 * Personal info form for step 0 of the CV creation wizard.
 * @param props - CVBaseFormProps
 */
export function CVBaseForm({ form, saving, hasCv, onNext, onBack }: CVBaseFormProps) {
  const { t } = useTranslation()

  return (
    <WizardCard header={t('cv.base.personalInfo')}>
      <Form form={form} layout="vertical" requiredMark="optional">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <FormItem name="fullName" label={t('cv.base.fullName')} rules={[{ required: true, message: t('cv.base.required') }]}>
              <Input placeholder={t('cv.base.fullNamePlaceholder')} />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem name="email" label={t('cv.base.email')} rules={[{ required: true, type: 'email', message: t('cv.base.invalidEmail') }]}>
              <Input placeholder={t('cv.base.emailPlaceholder')} />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem name="phone" label={t('cv.base.phone')}>
              <Input placeholder={t('cv.base.phonePlaceholder')} />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem name="location" label={t('cv.base.location')}>
              <Input placeholder={t('cv.base.locationPlaceholder')} />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem name="linkedin" label={t('cv.base.linkedin')}>
              <Input placeholder={t('cv.base.linkedinPlaceholder')} />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem name="languages" label={t('cv.base.languages')}>
              <Select mode="multiple" options={LANGUAGE_OPTIONS} placeholder={t('cv.base.languagesPlaceholder')} />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.lg }}>
        {hasCv ? (
          <DSButton variant="ghost" onClick={onBack}>
            <ArrowLeftOutlined /> {t('common.back')}
          </DSButton>
        ) : <span />}
        <DSButton variant="primary" onClick={onNext} loading={saving}>
          {t('cv.base.saveAndContinue')} <ArrowRightOutlined />
        </DSButton>
      </div>
    </WizardCard>
  )
}

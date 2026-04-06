/**
 * @file CVBaseForm.tsx
 * @description CVBaseForm — step 0 of CV wizard, redesigned to match mockup.
 */
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { CVBaseFormProps } from './CVBaseForm.types'
import { Form, FormItem } from '../../../../components/Form'
import { Input } from '../../../../components/Input'
import { Select } from '../../../../components/Select'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { TipBox } from '../../../../design-system/primitives/TipBox'
import { Row } from '../../../../components/Row'
import { Col } from '../../../../components/Col'
import { LANGUAGE_OPTIONS } from '../../constants'
import { Colors } from '../../../../styles/theme/colors'
import * as styles from './CVBaseForm.styles'

export function CVBaseForm({ form, saving, hasCv, stepLabel, onNext, onBack }: CVBaseFormProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.cardRoot}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerIcon}>
          <UserOutlined />
        </div>
        <div>
          <h3 className={styles.headerTitle}>
            {t('cv.base.personalInfo')}
          </h3>
          <p className={styles.headerSubtitle}>
            {t('cv.base.personalInfoSub')}
          </p>
        </div>
      </div>

      <div className={styles.cardBody}>
        {/* Avatar Upload Zone */}
        <div className={styles.avatarZone}>
          <div className={styles.avatarLeft}>
            <div className={styles.avatarCircle}>
              📷
            </div>
            <div>
              <p className={styles.avatarLabel}>
                {t('cv.base.addPhoto')}
              </p>
              <p className={styles.avatarHint}>
                {t('cv.base.avatarDragHint')}
              </p>
            </div>
          </div>
          <button type="button" className={styles.choosePhotoBtn}>
            {t('cv.base.choosePhoto')}
          </button>
        </div>

        {/* Form Fields */}
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={[16, 0]}>
            {/* Full row: Nome */}
            <Col xs={24}>
              <FormItem name="fullName" label={t('cv.base.fullName')} rules={[{ required: true, message: t('cv.base.required') }]}>
                <Input prefix={<UserOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.base.fullNamePlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: Cargo | Cidade */}
            <Col xs={24} sm={12}>
              <FormItem name="title" label={t('cv.titleField')}>
                <Input prefix={<ToolOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.titlePlaceholder')} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem name="location" label={t('cv.base.location')}>
                <Input prefix={<EnvironmentOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.base.locationPlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: Email | Telefone */}
            <Col xs={24} sm={12}>
              <FormItem name="email" label={t('cv.base.email')} rules={[{ required: true, type: 'email', message: t('cv.base.invalidEmail') }]}>
                <Input prefix={<MailOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.base.emailPlaceholder')} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem name="phone" label={t('cv.base.phone')}>
                <Input prefix={<PhoneOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.base.phonePlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: LinkedIn | GitHub */}
            <Col xs={24} sm={12}>
              <FormItem name="linkedin" label={t('cv.base.linkedin')}>
                <Input prefix={<span style={{ color: Colors.textSub, fontSize: '1.4rem' }}>🔗</span>} placeholder={t('cv.base.linkedinPlaceholder')} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem name="github" label={t('cv.github')}>
                <Input prefix={<GithubOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.githubPlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: Website */}
            <Col xs={24} sm={12}>
              <FormItem name="website" label={t('cv.website')}>
                <Input prefix={<GlobalOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.websitePlaceholder')} />
              </FormItem>
            </Col>

            {/* Idiomas */}
            <Col xs={24} sm={12}>
              <FormItem name="languages" label={t('cv.base.languages')}>
                <Select mode="multiple" options={LANGUAGE_OPTIONS} placeholder={t('cv.base.languagesPlaceholder')} />
              </FormItem>
            </Col>
          </Row>
        </Form>

        {/* Tip box */}
        <TipBox message={`💡 ${t('cv.base.avatarHint')}`} />
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        {hasCv ? (
          <DSButton variant="ghost" onClick={onBack}>
            <ArrowLeftOutlined /> {t('common.back')}
          </DSButton>
        ) : <span />}

        {stepLabel && (
          <span className={styles.stepLabelText}>
            {stepLabel}
          </span>
        )}

        <DSButton variant="primary" onClick={onNext} loading={saving}>
          {t('cv.base.saveAndContinue')} <ArrowRightOutlined />
        </DSButton>
      </div>
    </div>
  )
}

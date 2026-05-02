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
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { Row } from '../../../../components/Row'
import { Col } from '../../../../components/Col'
import { Colors } from '../../../../styles/theme/colors'
import * as styles from './CVBaseForm.styles'

export function CVBaseForm({ form, saving, hasCv, isMobile, onNext, onBack }: CVBaseFormProps) {
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
              <FormItem name="objective" label={t('cv.titleField')}>
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
                <Input
                  prefix={<PhoneOutlined style={{ color: Colors.textSub }} />}
                  placeholder={t('cv.base.phonePlaceholder')}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '')
                    // Limit to 13 digits (2 country + 2 area + 9 number)
                    const limitedValue = rawValue.substring(0, 13)

                    if (limitedValue.length === 0) {
                      form.setFieldValue('phone', '')
                      return
                    }

                    let formatted = `+${limitedValue.substring(0, 2)}`
                    if (limitedValue.length > 2) {
                      formatted += ` ${limitedValue.substring(2, 4)}`
                    }
                    if (limitedValue.length > 4) {
                      formatted += ` ${limitedValue.substring(4, 9)}`
                    }
                    if (limitedValue.length > 9) {
                      formatted += `-${limitedValue.substring(9, 13)}`
                    }

                    form.setFieldValue('phone', formatted)
                  }}
                />
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

            {/* Row: Portfolio */}
            <Col xs={24} sm={12}>
              <FormItem name="portfolio" label={t('cv.portfolio')}>
                <Input prefix={<GlobalOutlined style={{ color: Colors.textSub }} />} placeholder={t('cv.portfolioPlaceholder')} />
              </FormItem>
            </Col>

          </Row>
        </Form>

      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        {hasCv ? (
          <DSButton variant="ghost" onClick={onBack}>
            <ArrowLeftOutlined /> {t('common.back')}
          </DSButton>
        ) : <span />}

        {!isMobile && (
          <DSButton variant="primary" onClick={onNext} loading={saving}>
            {t('cv.base.saveAndContinue')} <ArrowRightOutlined />
          </DSButton>
        )}
      </div>
    </div>
  )
}

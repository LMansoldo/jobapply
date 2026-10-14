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
import { Form, FormItem } from '../../../design-system/wrappers/Form'
import { Input } from '../../../design-system/wrappers/Input'
import { DSButton } from '@jobapply/ui'
import { Row } from '../../../design-system/wrappers/Row'
import { Col } from '../../../design-system/wrappers/Col'
import * as styles from './CVBaseForm.styles'

export function CVBaseForm({ form, saving, hasCv, isMobile, onNext, onBack }: CVBaseFormProps) {
  const { t } = useTranslation()

  return (
    <styles.CardRoot>
      {/* Card header */}
      <styles.CardHeader>
        <styles.HeaderIcon>
          <UserOutlined />
        </styles.HeaderIcon>
        <div>
          <styles.HeaderTitle>
            {t('cv.base.personalInfo')}
          </styles.HeaderTitle>
          <styles.HeaderSubtitle>
            {t('cv.base.personalInfoSub')}
          </styles.HeaderSubtitle>
        </div>
      </styles.CardHeader>

      <styles.CardBody>
        {/* Form Fields */}
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={[16, 0]}>
            {/* Full row: Nome */}
            <Col xs={24}>
              <FormItem name="fullName" label={t('cv.base.fullName')} rules={[{ required: true, message: t('cv.base.required') }]}>
                <Input prefix={<styles.PrefixIcon><UserOutlined /></styles.PrefixIcon>} placeholder={t('cv.base.fullNamePlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: Cargo | Cidade */}
            <Col xs={24} sm={12}>
              <FormItem name="objective" label={t('cv.titleField')}>
                <Input prefix={<styles.PrefixIcon><ToolOutlined /></styles.PrefixIcon>} placeholder={t('cv.titlePlaceholder')} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem name="location" label={t('cv.base.location')}>
                <Input prefix={<styles.PrefixIcon><EnvironmentOutlined /></styles.PrefixIcon>} placeholder={t('cv.base.locationPlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: Email | Telefone */}
            <Col xs={24} sm={12}>
              <FormItem name="email" label={t('cv.base.email')} rules={[{ required: true, type: 'email', message: t('cv.base.invalidEmail') }]}>
                <Input prefix={<styles.PrefixIcon><MailOutlined /></styles.PrefixIcon>} placeholder={t('cv.base.emailPlaceholder')} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem name="phone" label={t('cv.base.phone')}>
                <Input
                  prefix={<styles.PrefixIcon><PhoneOutlined /></styles.PrefixIcon>}
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
                <Input prefix={<styles.PrefixEmoji>🔗</styles.PrefixEmoji>} placeholder={t('cv.base.linkedinPlaceholder')} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem name="github" label={t('cv.github')}>
                <Input prefix={<styles.PrefixIcon><GithubOutlined /></styles.PrefixIcon>} placeholder={t('cv.githubPlaceholder')} />
              </FormItem>
            </Col>

            {/* Row: Portfolio */}
            <Col xs={24} sm={12}>
              <FormItem name="portfolio" label={t('cv.portfolio')}>
                <Input prefix={<styles.PrefixIcon><GlobalOutlined /></styles.PrefixIcon>} placeholder={t('cv.portfolioPlaceholder')} />
              </FormItem>
            </Col>

          </Row>
        </Form>

      </styles.CardBody>

      {/* Footer */}
      <styles.CardFooter>
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
      </styles.CardFooter>
    </styles.CardRoot>
  )
}

import { useState } from 'react'
import { MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../components/AntApp'
import { Form, FormItem } from '../../../components/Form'
import { InputPassword } from '../../../components/Input'
import { Divider } from '../../../components/Divider'
import { useAuth } from '../../../application/providers/AuthProvider'
import { login as loginService } from '../../../infrastructure/repositories/authRepository'
import { AuthLayout } from '../../../design-system/auth/AuthLayout'
import { FeatureCard } from '../../../design-system/auth/FeatureCard'
import { SocialLoginBtn } from '../../../design-system/auth/SocialLoginBtn'
import { DSButton } from '../../../design-system/primitives/DSButton'
import { DSInput } from '../../../design-system/primitives/DSInput'
import * as styles from './LoginPage.styles'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { message } = useAntApp()
  const { t } = useTranslation()

  async function handleSubmit(values: LoginForm) {
    setLoading(true)
    try {
      const { token, user } = await loginService(values.email, values.password)
      login(token, user)
      message.success(t('auth.loginSuccess', { name: user.name }))
      navigate('/')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('auth.loginError')
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const leftPanel = (
    <div className={styles.leftPanelRoot}>
      <div>
        <h1 className={styles.leftHeadline}>{t('auth.loginHero')}</h1>
        <p className={styles.leftSubtitle}>{t('auth.loginHeroSub')}</p>
      </div>
      <div className={styles.leftFeatures}>
        <FeatureCard icon={<RocketOutlined />} title={t('auth.featureAITitle')} description={t('auth.featureAIDesc')} />
        <FeatureCard icon={<FileTextOutlined />} title={t('auth.featureCVTitle')} description={t('auth.featureCVDesc')} />
        <FeatureCard icon={<ThunderboltOutlined />} title={t('auth.featureATSTitle')} description={t('auth.featureATSDesc')} />
      </div>
    </div>
  )

  const rightPanel = (
    <div className={styles.rightPanelRoot}>
      <div className={styles.rightHeadingRow}>
        <h2 className={styles.rightTitle}>{t('auth.loginTitle')}</h2>
        <p className={styles.rightSubtitle}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className={styles.registerLink}>
            {t('auth.register')}
          </Link>
        </p>
      </div>

      <div className={styles.socialBtns}>
        <SocialLoginBtn provider="google" onClick={() => {}} />
        <SocialLoginBtn provider="linkedin" onClick={() => {}} />
      </div>

      <Divider plain className={styles.dividerOr}>{t('auth.orWithEmail')}</Divider>

      <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <FormItem
          name="email"
          label={t('auth.email')}
          rules={[
            { required: true, message: t('auth.requiredEmail') },
            { type: 'email', message: t('auth.invalidEmail') },
          ]}
        >
          <DSInput leftIcon={<MailOutlined />} placeholder={t('auth.emailPlaceholder')} filled />
        </FormItem>

        <FormItem
          name="password"
          label={t('auth.password')}
          className={styles.formItemSpacing}
          rules={[{ required: true, message: t('auth.requiredPassword') }]}
        >
          <InputPassword prefix={<LockOutlined />} placeholder={t('auth.passwordPlaceholder')} size="large" />
        </FormItem>

        <FormItem className={styles.formItemSmSpacing}>
          <div className={styles.fullWidthBtn}>
            <DSButton variant="primary" htmlType="submit" loading={loading} block>
              {t('auth.login')}
            </DSButton>
          </div>
        </FormItem>
      </Form>

      <div className={styles.demoBox}>
        <span className={styles.demoText}>{t('auth.demoCredentials')}</span>
      </div>
    </div>
  )

  return <AuthLayout left={leftPanel} right={rightPanel} />
}

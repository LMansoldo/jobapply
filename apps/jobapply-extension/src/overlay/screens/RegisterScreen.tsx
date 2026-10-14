import { useState } from 'react'
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Form, Input, App } from 'antd'
import { DSButton, DSInput } from '@jobapply/ui'
import { AuthLayout } from '../../auth-ui/AuthLayout'
import { FeatureCard } from '../../auth-ui/FeatureCard'
import { PasswordStrength } from '../../auth-ui/PasswordStrength'
import { SocialLoginBtn } from '../../auth-ui/SocialLoginBtn'
import {
  LeftPanelRoot,
  LeftHeadline,
  LeftSubtitle,
  LeftFeatures,
  RightPanelRoot,
  RightHeadingRow,
  RightTitle,
  RightSubtitle,
  LoginLink,
  SocialBtns,
  FullWidthBtn,
  FormItemSpacing,
  FormItemSubmit,
  DividerOr,
} from './RegisterPage.styles'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4
}

interface RegisterScreenProps {
  onRegistered: () => void
  onBackToLogin: () => void
}

export function RegisterScreen({ onRegistered, onBackToLogin }: RegisterScreenProps) {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { message } = App.useApp()
  const { t } = useTranslation()

  async function handleSubmit(values: RegisterForm) {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3030'}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
      })
      const data = (await res.json().catch(() => null)) as { message?: string } | null
      if (!res.ok) throw new Error(data?.message ?? t('auth.registerError'))
      message.success(t('auth.registerSuccess'))
      onRegistered()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('auth.registerError')
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const leftPanel = (
    <LeftPanelRoot>
      <div>
        <LeftHeadline>{t('auth.registerHero')}</LeftHeadline>
        <LeftSubtitle>{t('auth.registerHeroSub')}</LeftSubtitle>
      </div>
      <LeftFeatures>
        <FeatureCard icon={<RocketOutlined />} title={t('auth.featureAITitle')} description={t('auth.featureAIDesc')} />
        <FeatureCard icon={<FileTextOutlined />} title={t('auth.featureCVTitle')} description={t('auth.featureCVDesc')} />
        <FeatureCard icon={<ThunderboltOutlined />} title={t('auth.featureATSTitle')} description={t('auth.featureATSDesc')} />
      </LeftFeatures>
    </LeftPanelRoot>
  )

  const rightPanel = (
    <RightPanelRoot>
      <RightHeadingRow>
        <RightTitle>{t('auth.registerTitle')}</RightTitle>
        <RightSubtitle>
          {t('auth.hasAccount')}{' '}
          <LoginLink type="button" onClick={onBackToLogin}>
            {t('auth.login')}
          </LoginLink>
        </RightSubtitle>
      </RightHeadingRow>

      <SocialBtns>
        <SocialLoginBtn provider="linkedin" onClick={() => {}} />
      </SocialBtns>

      <DividerOr plain>{t('auth.orWithEmail')}</DividerOr>

      <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          name="name"
          label={t('auth.name')}
          rules={[{ required: true, message: t('auth.requiredName') }]}
        >
          <DSInput leftIcon={<UserOutlined />} placeholder={t('auth.namePlaceholder')} filled />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('auth.email')}
          rules={[
            { required: true, message: t('auth.requiredEmail') },
            { type: 'email', message: t('auth.invalidEmail') },
          ]}
        >
          <DSInput leftIcon={<MailOutlined />} placeholder={t('auth.emailPlaceholder')} filled />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('auth.password')}
          rules={[
            { required: true, message: t('auth.requiredPassword') },
            { min: 6, message: t('auth.minPassword') },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.minPasswordPlaceholder')}
            size="large"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <PasswordStrength value={getPasswordStrength(password)} />

        <FormItemSpacing
          name="confirmPassword"
          label={t('auth.confirmPassword')}
          dependencies={['password']}
          rules={[
            { required: true, message: t('auth.requiredConfirm') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('auth.passwordMismatch')))
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t('auth.confirmPasswordPlaceholder')} size="large" />
        </FormItemSpacing>

        <FormItemSubmit>
          <FullWidthBtn>
            <DSButton variant="primary" htmlType="submit" loading={loading} block>
              {t('auth.register')}
            </DSButton>
          </FullWidthBtn>
        </FormItemSubmit>
      </Form>
    </RightPanelRoot>
  )

  return <AuthLayout left={leftPanel} right={rightPanel} />
}

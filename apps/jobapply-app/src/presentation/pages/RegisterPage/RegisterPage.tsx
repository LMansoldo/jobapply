import { useState } from 'react'
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../design-system/wrappers/AntApp'
import { Form, FormItem } from '../../../design-system/wrappers/Form'
import { InputPassword } from '../../../design-system/wrappers/Input'
import { register as registerService } from '../../../infrastructure/repositories/authRepository'
import { redirectToLinkedIn } from '../../../domain/linkedin/linkedinOAuth'
import { AuthLayout } from '../../../design-system/auth/AuthLayout'
import { FeatureCard } from '../../../design-system/auth/FeatureCard'
import { PasswordStrength } from '../../../design-system/auth/PasswordStrength'
import { SocialLoginBtn } from '../../../design-system/auth/SocialLoginBtn'
import { DSButton } from '@jobapply/ui'
import { DSInput } from '@jobapply/ui'
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

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { message } = useAntApp()
  const { t } = useTranslation()

  async function handleSubmit(values: RegisterForm) {
    setLoading(true)
    try {
      await registerService(values.name, values.email, values.password)
      message.success(t('auth.registerSuccess'))
      navigate({ to: '/login' })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('auth.registerError')
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
          <LoginLink to="/login">
            {t('auth.login')}
          </LoginLink>
        </RightSubtitle>
      </RightHeadingRow>

      <SocialBtns>
        <SocialLoginBtn provider="linkedin" onClick={() => redirectToLinkedIn('login')} />
      </SocialBtns>

      <DividerOr plain>{t('auth.orWithEmail')}</DividerOr>

      <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <FormItem
          name="name"
          label={t('auth.name')}
          rules={[{ required: true, message: t('auth.requiredName') }]}
        >
          <DSInput leftIcon={<UserOutlined />} placeholder={t('auth.namePlaceholder')} filled />
        </FormItem>

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
          rules={[
            { required: true, message: t('auth.requiredPassword') },
            { min: 6, message: t('auth.minPassword') },
          ]}
        >
          <InputPassword
            prefix={<LockOutlined />}
            placeholder={t('auth.minPasswordPlaceholder')}
            size="large"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormItem>

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
          <InputPassword prefix={<LockOutlined />} placeholder={t('auth.confirmPasswordPlaceholder')} size="large" />
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

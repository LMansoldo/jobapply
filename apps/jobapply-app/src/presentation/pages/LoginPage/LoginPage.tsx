import { useState } from 'react'
import { MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../design-system/wrappers/AntApp'
import { Form, FormItem } from '../../../design-system/wrappers/Form'
import { InputPassword } from '../../../design-system/wrappers/Input'
import { useAuth } from '../../../application/providers/AuthProvider'
import { login as loginService } from '../../../infrastructure/repositories/authRepository'
import { redirectToLinkedIn } from '../../../domain/linkedin/linkedinOAuth'
import { AuthLayout } from '../../../design-system/auth/AuthLayout'
import { FeatureCard } from '../../../design-system/auth/FeatureCard'
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
  RegisterLink,
  SocialBtns,
  FullWidthBtn,
  FormItemSpacing,
  FormItemSmSpacing,
  DividerOr,
} from './LoginPage.styles'

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
      const isOnboarded = localStorage.getItem('jobapply_onboarded') === 'true'
      navigate({ to: isOnboarded ? (user.cv ? '/tailoring' : '/cv') : '/onboarding' })
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
    <LeftPanelRoot>
      <div>
        <LeftHeadline>{t('auth.loginHero')}</LeftHeadline>
        <LeftSubtitle>{t('auth.loginHeroSub')}</LeftSubtitle>
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
        <RightTitle>{t('auth.loginTitle')}</RightTitle>
        <RightSubtitle>
          {t('auth.noAccount')}{' '}
          <RegisterLink to="/register">
            {t('auth.register')}
          </RegisterLink>
        </RightSubtitle>
      </RightHeadingRow>

      <SocialBtns>
        <SocialLoginBtn provider="linkedin" onClick={() => redirectToLinkedIn('login')} />
      </SocialBtns>

      <DividerOr plain>{t('auth.orWithEmail')}</DividerOr>

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

        <FormItemSpacing
          name="password"
          label={t('auth.password')}
          rules={[{ required: true, message: t('auth.requiredPassword') }]}
        >
          <InputPassword prefix={<LockOutlined />} placeholder={t('auth.passwordPlaceholder')} size="large" />
        </FormItemSpacing>

        <FormItemSmSpacing>
          <FullWidthBtn>
            <DSButton variant="primary" htmlType="submit" loading={loading} block>
              {t('auth.login')}
            </DSButton>
          </FullWidthBtn>
        </FormItemSmSpacing>
      </Form>

    </RightPanelRoot>
  )

  return <AuthLayout left={leftPanel} right={rightPanel} />
}

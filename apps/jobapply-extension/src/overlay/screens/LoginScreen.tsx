import { useState } from 'react'
import { MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'
import { DSButton, DSInput } from '@jobapply/ui'
import { AuthLayout } from '../../auth-ui/AuthLayout'
import { FeatureCard } from '../../auth-ui/FeatureCard'
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

interface LoginScreenProps {
  onLogin: (token: string, user: { id: string; name: string; email: string }) => void | Promise<void>
  onGoToRegister: () => void
}

export function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<LoginForm>()
  const { t } = useTranslation()

  async function handleSubmit(values: LoginForm) {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3030'}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      })
      const data = (await res.json().catch(() => null)) as
        | { token: string; user: { id: string; name: string; email: string }; message?: string }
        | null
      if (!res.ok || !data) throw new Error(data?.message ?? t('auth.loginError'))
      await onLogin(data.token, data.user)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('auth.loginError')
      form.setFields([{ name: 'email', errors: [msg] }])
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
          <RegisterLink type="button" onClick={onGoToRegister}>
            {t('auth.register')}
          </RegisterLink>
        </RightSubtitle>
      </RightHeadingRow>

      <SocialBtns>
        <SocialLoginBtn provider="linkedin" onClick={() => {}} />
      </SocialBtns>

      <DividerOr plain>{t('auth.orWithEmail')}</DividerOr>

      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
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

        <FormItemSpacing
          name="password"
          label={t('auth.password')}
          rules={[{ required: true, message: t('auth.requiredPassword') }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t('auth.passwordPlaceholder')} size="large" />
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

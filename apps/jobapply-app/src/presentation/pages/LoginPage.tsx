import { useState } from 'react'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../components/AntApp'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Form, FormItem } from '../../components/Form'
import { Input, InputPassword } from '../../components/Input'
import { Text, Title } from '../../components/Typography'
import { useAuth } from '../../application/providers/AuthProvider'
import { login as loginService } from '../../infrastructure/repositories/authRepository'
import { Colors } from '../../styles/theme/colors'
import { FontSize } from '../../styles/theme/typography'
import { Spacing } from '../../styles/theme/spacing'

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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: Colors.pageBg,
        padding: `${Spacing.lg} ${Spacing.md}`,
      }}
    >
      <Card style={{ width: '100%', maxWidth: Spacing.sidebarWidth, boxShadow: `0 0.4rem 2.4rem ${Colors.shadowMd}` }}>
        <div style={{ textAlign: 'center', marginBottom: Spacing.xl }}>
          <Title level={3} style={{ margin: 0 }}>
            {t('auth.appName')}
          </Title>
          <Text type="secondary">{t('auth.loginTitle')}</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <FormItem
            name="email"
            label={t('auth.email')}
            rules={[
              { required: true, message: t('auth.requiredEmail') },
              { type: 'email', message: t('auth.invalidEmail') },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder={t('auth.emailPlaceholder')} size="large" />
          </FormItem>

          <FormItem
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('auth.requiredPassword') }]}
          >
            <InputPassword prefix={<LockOutlined />} placeholder={t('auth.passwordPlaceholder')} size="large" />
          </FormItem>

          <FormItem style={{ marginBottom: Spacing.sm }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {t('auth.login')}
            </Button>
          </FormItem>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">{t('auth.noAccount')} </Text>
            <Link to="/register">{t('auth.register')}</Link>
          </div>
        </Form>

        <div style={{ marginTop: Spacing.md, padding: `${Spacing.sm} ${Spacing.md1}`, background: Colors.surfaceCode, borderRadius: Spacing.sm2 }}>
          <Text type="secondary" style={{ fontSize: FontSize.sm }}>
            {t('auth.demoCredentials')}
          </Text>
        </div>
      </Card>
    </div>
  )
}

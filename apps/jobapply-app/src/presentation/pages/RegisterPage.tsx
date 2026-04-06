import { useState } from 'react'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../components/AntApp'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Form, FormItem } from '../../components/Form'
import { Input, InputPassword } from '../../components/Input'
import { Text, Title } from '../../components/Typography'
import { register as registerService } from '../../infrastructure/repositories/authRepository'
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { message } = useAntApp()
  const { t } = useTranslation()

  async function handleSubmit(values: RegisterForm) {
    setLoading(true)
    try {
      await registerService(values.name, values.email, values.password)
      message.success(t('auth.registerSuccess'))
      navigate('/login')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('auth.registerError')
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
      <Card style={{ width: '100%', maxWidth: '42rem', boxShadow: `0 0.4rem 2.4rem ${Colors.shadowMd}` }}>
        <div style={{ textAlign: 'center', marginBottom: Spacing.xl }}>
          <Title level={3} style={{ margin: 0 }}>
            {t('auth.appName')}
          </Title>
          <Text type="secondary">{t('auth.registerTitle')}</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <FormItem
            name="name"
            label={t('auth.name')}
            rules={[{ required: true, message: t('auth.requiredName') }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('auth.namePlaceholder')} size="large" />
          </FormItem>

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
            rules={[
              { required: true, message: t('auth.requiredPassword') },
              { min: 6, message: t('auth.minPassword') },
            ]}
          >
            <InputPassword prefix={<LockOutlined />} placeholder={t('auth.minPasswordPlaceholder')} size="large" />
          </FormItem>

          <FormItem
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
          </FormItem>

          <FormItem style={{ marginBottom: Spacing.sm }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {t('auth.register')}
            </Button>
          </FormItem>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">{t('auth.hasAccount')} </Text>
            <Link to="/login">{t('auth.login')}</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

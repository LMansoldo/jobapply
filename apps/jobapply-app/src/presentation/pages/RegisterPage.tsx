import { useState } from 'react'
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../components/AntApp'
import { Form, FormItem } from '../../components/Form'
import { InputPassword } from '../../components/Input'
import { register as registerService } from '../../infrastructure/repositories/authRepository'
import { AuthLayout } from '../../design-system/auth/AuthLayout'
import { FeatureCard } from '../../design-system/auth/FeatureCard'
import { RoleCards } from '../../design-system/auth/RoleCards'
import { PasswordStrength } from '../../design-system/auth/PasswordStrength'
import { DSButton } from '../../design-system/primitives/DSButton'
import { DSInput } from '../../design-system/primitives/DSInput'
import { Colors } from '../../styles/theme/colors'
import { FontFamily, FontWeight, FontSize } from '../../styles/theme/typography'
import { Spacing } from '../../styles/theme/spacing'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const LEFT_PANEL = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
    <div>
      <h1 style={{ fontFamily: FontFamily.heading, color: Colors.white, fontSize: '3.2rem', margin: '0 0 0.8rem', fontWeight: FontWeight.bold, lineHeight: 1.15 }}>
        Comece sua jornada profissional
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: FontSize.base, margin: 0, lineHeight: 1.6 }}>
        Crie sua conta e tenha acesso a ferramentas de IA para candidaturas.
      </p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
      <FeatureCard icon={<RocketOutlined />} title="Candidatura com IA" description="Adapte seu CV automaticamente para cada vaga com inteligência artificial." />
      <FeatureCard icon={<FileTextOutlined />} title="CV Profissional" description="Crie e gerencie versões do seu CV em português e inglês." />
      <FeatureCard icon={<ThunderboltOutlined />} title="Score ATS" description="Analise o match do seu CV com os requisitos da vaga em segundos." />
    </div>
  </div>
)

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
  const [role, setRole] = useState('candidate')
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

  const RIGHT_PANEL = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
      <div style={{ marginBottom: Spacing.xs }}>
        <h2 style={{ fontFamily: FontFamily.heading, fontSize: '2.2rem', color: Colors.textMain, margin: '0 0 0.4rem', fontWeight: FontWeight.bold }}>
          {t('auth.registerTitle')}
        </h2>
        <p style={{ color: Colors.textSub, fontSize: FontSize.base, margin: 0 }}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" style={{ color: Colors.primaryDark, fontWeight: FontWeight.semibold }}>
            {t('auth.login')}
          </Link>
        </p>
      </div>

      <RoleCards
        roles={[
          { key: 'candidate', label: 'Candidato', icon: '👤' },
          { key: 'recruiter', label: 'Recrutador', icon: '🔍' },
        ]}
        value={role}
        onChange={setRole}
      />

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

        <FormItem
          name="confirmPassword"
          label={t('auth.confirmPassword')}
          dependencies={['password']}
          style={{ marginTop: Spacing.sm }}
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

        <FormItem style={{ marginBottom: Spacing.xs, marginTop: Spacing.sm }}>
          <DSButton variant="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            {t('auth.register')}
          </DSButton>
        </FormItem>
      </Form>
    </div>
  )

  return <AuthLayout left={LEFT_PANEL} right={RIGHT_PANEL} />
}

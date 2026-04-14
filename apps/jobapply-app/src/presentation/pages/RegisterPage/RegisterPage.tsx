import { useState } from 'react'
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../components/AntApp'
import { Form, FormItem } from '../../../components/Form'
import { InputPassword } from '../../../components/Input'
import { register as registerService } from '../../../infrastructure/repositories/authRepository'
import { AuthLayout } from '../../../design-system/auth/AuthLayout'
import { FeatureCard } from '../../../design-system/auth/FeatureCard'
import { RoleCards } from '../../../design-system/auth/RoleCards'
import { PasswordStrength } from '../../../design-system/auth/PasswordStrength'
import { DSButton } from '../../../design-system/primitives/DSButton'
import { DSInput } from '../../../design-system/primitives/DSInput'
import * as styles from './RegisterPage.styles'

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

  const leftPanel = (
    <div className={styles.leftPanelRoot}>
      <div>
        <h1 className={styles.leftHeadline}>{t('auth.registerHero')}</h1>
        <p className={styles.leftSubtitle}>{t('auth.registerHeroSub')}</p>
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
        <h2 className={styles.rightTitle}>{t('auth.registerTitle')}</h2>
        <p className={styles.rightSubtitle}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className={styles.loginLink}>
            {t('auth.login')}
          </Link>
        </p>
      </div>

      <RoleCards
        roles={[
          { key: 'candidate', label: t('auth.roleCandidate'), icon: '👤' },
          { key: 'recruiter', label: t('auth.roleRecruiter'), icon: '🔍' },
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
          className={styles.formItemSpacing}
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

        <FormItem className={styles.formItemSubmit}>
          <div className={styles.fullWidthBtn}>
            <DSButton variant="primary" htmlType="submit" loading={loading} block>
              {t('auth.register')}
            </DSButton>
          </div>
        </FormItem>
      </Form>
    </div>
  )

  return <AuthLayout left={leftPanel} right={rightPanel} />
}

/**
 * @file LinkedInCallbackPage.tsx
 * @description Handles OAuth redirect from LinkedIn.
 * Exchanges the code via backend, then redirects based on action (login | analyze).
 */
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LinkedinOutlined } from '@ant-design/icons'
import { useAuth } from '../../../application/providers/AuthProvider'
import { handleLinkedInCallback } from '../../../infrastructure/repositories/linkedinRepository'
import { popReturnPath } from '../../../domain/linkedin/linkedinOAuth'
import * as S from './LinkedInCallbackPage.styles'

export default function LinkedInCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state') ?? ''

    if (!code) {
      setError(true)
      return
    }

    handleLinkedInCallback(code, state)
      .then((result) => {
        if (result.action === 'login' && result.token && result.user) {
          login(result.token, result.user)
          const isOnboarded = localStorage.getItem('jobapply_onboarded') === 'true'
          if (!isOnboarded) {
            navigate({ to: '/onboarding' })
          } else if (!result.user.cv) {
            sessionStorage.setItem('cv_prefill_from_linkedin', 'true')
            navigate({ to: '/cv' })
          } else {
            navigate({ to: '/' })
          }
        } else {
          const returnPath = popReturnPath()
          navigate({ to: returnPath as '/' })
        }
      })
      .catch(() => setError(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className={S.root}>
        <LinkedinOutlined className={S.icon} />
        <p className={S.message}>{t('linkedin.callbackError')}</p>
        <button type="button" className={S.backBtn} onClick={() => navigate({ to: '/' })}>
          {t('common.back')}
        </button>
      </div>
    )
  }

  return (
    <div className={S.root}>
      <LinkedinOutlined className={S.icon} />
      <p className={S.message}>{t('linkedin.callbackConnecting')}</p>
    </div>
  )
}

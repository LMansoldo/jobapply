import api, { USE_MOCK } from '../http/client'
import type { OnboardingData } from '../../presentation/pages/OnboardingPage/OnboardingPage.types'

export async function submitOnboarding(data: OnboardingData): Promise<void> {
  if (USE_MOCK) return
  await api.post('/users/onboarding', data)
}

import api, { USE_MOCK } from '../http/client'
import type { LinkedInAnalysis, AnalyzeLinkedInPayload, LinkedInOAuthProfile, LinkedInProfile, VoiceAnswers } from '../../domain/linkedin/types'
import { setLinkedInConnected } from '../../domain/linkedin/linkedinOAuth'
import { parsePDFToLinkedInProfile } from '../../domain/linkedin/pdfParser'
import type { User } from '../../domain/auth/types'
import { MOCK_LINKEDIN_PROFILE, MOCK_LINKEDIN_ANALYSIS } from '../mock/linkedinMockData'

function oauthProfileToLinkedInProfile(oauth: LinkedInOAuthProfile): LinkedInProfile {
  return {
    headline: oauth.name,
    about: '',
    experience: '',
    skills: '',
    education: '',
  }
}

const REDIRECT_URI = `${window.location.origin}/linkedin-callback`

function delay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms))
}

export interface LinkedInCallbackResult {
  action: 'login' | 'analyze'
  token?: string
  user?: User
}

type CallbackApiResponse =
  | { token: string; user: User }
  | { profile: LinkedInOAuthProfile }

/** Called by the callback page after LinkedIn redirects back with a `code`. */
export async function handleLinkedInCallback(code: string, state: string): Promise<LinkedInCallbackResult> {
  const action = state.startsWith('login') ? 'login' : 'analyze'

  if (USE_MOCK) {
    await delay(1000)
    if (action === 'analyze') {
      setLinkedInConnected(MOCK_LINKEDIN_PROFILE)
      return { action }
    }
    const { MOCK_USER, MOCK_TOKEN } = await import('../mock/data')
    return { action, token: MOCK_TOKEN, user: MOCK_USER }
  }

  const { data } = await api.post<CallbackApiResponse>('/auth/linkedin/callback', {
    code,
    state,
    redirect_uri: REDIRECT_URI,
    action,
  })

  if (action === 'analyze' && 'profile' in data) {
    // OAuth returned basic profile (name/email/picture).
    // Convert to LinkedInProfile shape so workspace can trigger analysis.
    setLinkedInConnected(oauthProfileToLinkedInProfile(data.profile))
    return { action }
  }

  if (action === 'login' && 'token' in data) {
    return { action, token: data.token, user: data.user }
  }

  return { action }
}

export async function analyzeLinkedIn(payload: AnalyzeLinkedInPayload): Promise<LinkedInAnalysis> {
  if (USE_MOCK) {
    await delay(1800)
    return MOCK_LINKEDIN_ANALYSIS
  }

  const { data } = await api.post<LinkedInAnalysis>('/cv/linkedin/analyze', payload)
  return data
}

export async function analyzeLinkedInPDF(file: File, voiceAnswers?: VoiceAnswers): Promise<LinkedInAnalysis> {
  if (USE_MOCK) {
    await delay(2000)
    return MOCK_LINKEDIN_ANALYSIS
  }

  const profile = await parsePDFToLinkedInProfile(file)
  return analyzeLinkedIn({ profile, voiceAnswers })
}

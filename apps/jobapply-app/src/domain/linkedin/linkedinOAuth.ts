/**
 * @file linkedinOAuth.ts
 * @description Helpers for LinkedIn OAuth flow — connection state, redirect URLs.
 * Auth uses the backend as a proxy (/auth/linkedin) to keep client_secret server-side.
 * In mock mode (VITE_USE_MOCK !== 'false') the redirect bypasses the backend entirely.
 */
import type { LinkedInProfile } from './types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const STORAGE_CONNECTED = 'linkedin_connected'
const STORAGE_PROFILE = 'linkedin_profile'
const STORAGE_RETURN_PATH = 'linkedin_return_path'

export function isLinkedInConnected(): boolean {
  return localStorage.getItem(STORAGE_CONNECTED) === 'true'
}

export function getLinkedInProfile(): LinkedInProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE)
    return raw ? (JSON.parse(raw) as LinkedInProfile) : null
  } catch {
    return null
  }
}

export function setLinkedInConnected(profile: LinkedInProfile): void {
  localStorage.setItem(STORAGE_CONNECTED, 'true')
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile))
}

export function clearLinkedInAuth(): void {
  localStorage.removeItem(STORAGE_CONNECTED)
  localStorage.removeItem(STORAGE_PROFILE)
}

export function saveReturnPath(path: string): void {
  sessionStorage.setItem(STORAGE_RETURN_PATH, path)
}

export function popReturnPath(): string {
  const path = sessionStorage.getItem(STORAGE_RETURN_PATH) ?? '/'
  sessionStorage.removeItem(STORAGE_RETURN_PATH)
  return path
}

/** Redirects to LinkedIn OAuth.
 *  Mock mode: goes directly to the callback page (no backend needed).
 *  Production: goes through the backend proxy /auth/linkedin.
 */
export function redirectToLinkedIn(action: 'login' | 'analyze'): void {
  const state = `${action}:${crypto.randomUUID()}`
  saveReturnPath(window.location.pathname + window.location.search)
  sessionStorage.setItem('linkedin_oauth_state', state)

  if (USE_MOCK) {
    window.location.href = `/linkedin-callback?code=mock-code&state=${encodeURIComponent(state)}`
    return
  }

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  const redirectUri = `${window.location.origin}/linkedin-callback`
  window.location.href = `${baseUrl}/auth/linkedin?redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
}

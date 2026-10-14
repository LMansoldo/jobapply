export const CAPTURED_JOB_KEY = 'jobapply:capturedJob'
export const AUTH_KEY = 'jobapply:auth'
export const CV_ID_KEY = 'jobapply:cvId'

export interface CapturedJob {
  jdText: string
  sourceUrl: string
  capturedAt: string
}

export interface StoredAuth {
  token: string
  user: {
    id: string
    name: string
    email: string
    cv?: string | null
  }
  authAt: number
}

// JWT persists across browser restarts; treated as expired after 24h
export const AUTH_TTL_MS = 24 * 60 * 60 * 1000

export async function saveCapturedJob(job: CapturedJob): Promise<void> {
  await chrome.storage.session.set({ [CAPTURED_JOB_KEY]: job })
}

export async function getCapturedJob(): Promise<CapturedJob | null> {
  const result = await chrome.storage.session.get(CAPTURED_JOB_KEY)
  const job = result[CAPTURED_JOB_KEY] as CapturedJob | undefined
  return job ?? null
}

export async function clearCapturedJob(): Promise<void> {
  await chrome.storage.session.remove(CAPTURED_JOB_KEY)
}

export async function saveAuth(auth: Omit<StoredAuth, 'authAt'>): Promise<void> {
  await chrome.storage.local.set({ [AUTH_KEY]: { ...auth, authAt: Date.now() } })
}

export async function getAuth(): Promise<StoredAuth | null> {
  const result = await chrome.storage.local.get(AUTH_KEY)
  const auth = result[AUTH_KEY] as StoredAuth | undefined
  if (!auth) return null
  if (Date.now() - auth.authAt > AUTH_TTL_MS) {
    await chrome.storage.local.remove(AUTH_KEY)
    return null
  }
  return auth
}

export async function clearAuth(): Promise<void> {
  await chrome.storage.local.remove(AUTH_KEY)
}

export async function saveCvId(cvId: string): Promise<void> {
  await chrome.storage.session.set({ [CV_ID_KEY]: cvId })
}

export async function getCvId(): Promise<string | null> {
  const result = await chrome.storage.session.get(CV_ID_KEY)
  const cvId = result[CV_ID_KEY] as string | undefined
  return cvId ?? null
}

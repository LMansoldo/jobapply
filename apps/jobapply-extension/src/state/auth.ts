import { clearAuth, getAuth, saveAuth, type StoredAuth } from '../shared/storage'

export type { StoredAuth as AuthState }

export async function loadAuth(): Promise<StoredAuth | null> {
  return getAuth()
}

export async function persistAuth(token: string, user: StoredAuth['user']): Promise<void> {
  await saveAuth({ token, user })
}

export async function removeAuth(): Promise<void> {
  await clearAuth()
}

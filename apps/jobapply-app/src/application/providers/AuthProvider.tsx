import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../../domain/auth/types'

interface AuthContextValue {
  user: User | null
  token: string | null
  /** Derived from user.cv — always in sync with the API response, never a separate key. */
  cvId: string | null
  login: (token: string, user: User) => void
  logout: () => void
  /** Update the CV reference on the in-memory (and persisted) user object. */
  setCvId: (id: string | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function extractCvId(user: User | null): string | null {
  if (!user?.cv) return null
  if (typeof user.cv === 'string') return user.cv
  const obj = user.cv as { _id?: string; $oid?: string }
  return obj.$oid ?? obj._id ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage<User>('user'))
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  // cvId is always derived from user.cv — no separate localStorage key.
  const cvId = extractCvId(user)

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  /**
   * Called by CVPage when a CV is created for the first time or fetched.
   * Updates user.cv in state and in the persisted user object so the derived
   * cvId stays consistent without a separate localStorage key.
   */
  const setCvId = useCallback((id: string | null) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated: User = { ...prev, cv: id ?? undefined }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, cvId, login, logout, setCvId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

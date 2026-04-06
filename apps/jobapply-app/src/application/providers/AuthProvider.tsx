import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../../domain/auth/types'

interface AuthContextValue {
  user: User | null
  token: string | null
  cvId: string | null
  login: (token: string, user: User) => void
  logout: () => void
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage<User>('user'))
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [cvId, setCvIdState] = useState<string | null>(() => {
    const stored = localStorage.getItem('cvId')
    if (stored) return stored
    // Fallback: derive from user object already in localStorage (existing sessions)
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw) as { cv?: string | { _id?: string; $oid?: string } | null }
        if (typeof u.cv === 'string') return u.cv
        if (u.cv && typeof u.cv === 'object') return u.cv.$oid ?? u.cv._id ?? null
      }
    } catch {}
    return null
  })

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    const cvId = typeof newUser.cv === 'string'
      ? newUser.cv
      : (newUser.cv as { _id?: string; $oid?: string } | null)?.$oid
        ?? (newUser.cv as { _id?: string; $oid?: string } | null)?._id
        ?? null
    if (cvId) {
      localStorage.setItem('cvId', cvId)
      setCvIdState(cvId)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cvId')
    setToken(null)
    setUser(null)
    setCvIdState(null)
  }, [])

  const setCvId = useCallback((id: string | null) => {
    if (id) {
      localStorage.setItem('cvId', id)
    } else {
      localStorage.removeItem('cvId')
    }
    setCvIdState(id)
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

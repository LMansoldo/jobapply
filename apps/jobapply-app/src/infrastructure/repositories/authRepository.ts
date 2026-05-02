import api, { USE_MOCK } from '../http/client'
import { MOCK_TOKEN, MOCK_USER } from '../mock/data'
import type { LoginResponse, RegisterResponse } from '../../domain/auth/types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay(600)
    if (email === 'lucas@test.com' && password === 'secret123') {
      return { token: MOCK_TOKEN, user: MOCK_USER }
    }
    throw { response: { data: { message: 'Credenciais inválidas' }, status: 401 } }
  }
  const { data } = await api.post<LoginResponse>('/users/login', { email, password })
  return data
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  if (USE_MOCK) {
    await delay(600)
    return { user: { id: 'user-new', name, email } }
  }
  const { data } = await api.post<RegisterResponse>('/users/register', { name, email, password })
  return data
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

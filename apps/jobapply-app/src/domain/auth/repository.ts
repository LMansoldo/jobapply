import type { LoginResponse, RegisterResponse } from './types'

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResponse>
  register(name: string, email: string, password: string): Promise<RegisterResponse>
}

export interface User {
  id: string
  name: string
  email: string
  // API returns cv as a string ID or as a populated object (with _id or $oid)
  cv?: string | { _id?: string; $oid?: string } | null
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterResponse {
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
}

export interface UserSession {
  user: User
  token: string
  expiresAt: string
}
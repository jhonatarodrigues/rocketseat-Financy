import { mockUser } from '../mocks/financeMock'
import type { LoginInput, RegisterInput, User } from '../types/finance'

const AUTH_STORAGE_KEY = '@financy:user'

type AuthResponse = {
  user: User
  token: string
}

const delay = <T,>(value: T) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 250)
  })

export const authRepository = {
  getPersistedUser() {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? (JSON.parse(storedUser) as User) : null
  },

  async login(input: LoginInput) {
    const name = input.email.split('@')[0] || mockUser.name
    const user = { ...mockUser, name, email: input.email }
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))

    return delay<AuthResponse>({
      user,
      token: 'mocked-jwt-token',
    })
  },

  async register(input: RegisterInput) {
    const user = { ...mockUser, name: input.name, email: input.email }
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))

    return delay<AuthResponse>({
      user,
      token: 'mocked-jwt-token',
    })
  },

  logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  },
}

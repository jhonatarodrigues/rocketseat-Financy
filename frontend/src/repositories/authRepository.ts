import {
  clearAuthToken,
  getAuthToken,
  graphqlRequest,
  persistAuthToken,
} from '../graphql/client'
import type { LoginInput, RegisterInput, User } from '../types/finance'

const AUTH_STORAGE_KEY = '@financy:user'

type AuthResponse = {
  user: User
  token: string
}

export const authRepository = {
  getToken() {
    return getAuthToken()
  },

  getPersistedUser() {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? (JSON.parse(storedUser) as User) : null
  },

  async login(input: LoginInput) {
    const data = await graphqlRequest<{ login: AuthResponse }, { input: LoginInput }>(
      /* GraphQL */ `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `,
      { input },
    )

    persistSession(data.login)

    return data.login
  },

  async register(input: RegisterInput) {
    const data = await graphqlRequest<{ register: AuthResponse }, { input: RegisterInput }>(
      /* GraphQL */ `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `,
      { input },
    )

    persistSession(data.register)

    return data.register
  },

  async me() {
    const data = await graphqlRequest<{ me: User }>(
      /* GraphQL */ `
        query Me {
          me {
            id
            name
            email
          }
        }
      `,
    )

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.me))

    return data.me
  },

  logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    clearAuthToken()
  },
}

function persistSession(response: AuthResponse) {
  persistAuthToken(response.token)
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user))
}

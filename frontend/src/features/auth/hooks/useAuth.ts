import { useState } from 'react'
import { authRepository } from '../../../repositories/authRepository'
import type { LoginInput, RegisterInput, User } from '../../../types/finance'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authRepository.getPersistedUser())
  const [isLoading, setIsLoading] = useState(false)

  async function login(input: LoginInput) {
    setIsLoading(true)
    try {
      const response = await authRepository.login(input)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  async function register(input: RegisterInput) {
    setIsLoading(true)
    try {
      const response = await authRepository.register(input)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    authRepository.logout()
    setUser(null)
  }

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  }
}

import { useEffect, useState } from 'react'
import { authRepository } from '../../../repositories/authRepository'
import type { LoginInput, RegisterInput, User } from '../../../types/finance'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authRepository.getPersistedUser())
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => Boolean(authRepository.getToken()))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      if (!authRepository.getToken()) {
        setIsCheckingAuth(false)
        return
      }

      try {
        const response = await authRepository.me()

        if (isMounted) {
          setUser(response)
        }
      } catch {
        authRepository.logout()

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  async function login(input: LoginInput) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authRepository.login(input)
      setUser(response.user)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  async function register(input: RegisterInput) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authRepository.register(input)
      setUser(response.user)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    authRepository.logout()
    setUser(null)
    setError(null)
  }

  return {
    user,
    error,
    isCheckingAuth,
    isLoading,
    login,
    register,
    logout,
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return 'E-mail ou senha inválidos.'
    }

    if (error.message === 'Email already registered') {
      return 'Este e-mail já está cadastrado.'
    }

    return error.message
  }

  return 'Não foi possível completar a ação. Tente novamente.'
}

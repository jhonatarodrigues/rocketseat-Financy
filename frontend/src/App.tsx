import { LoginPage } from './pages/LoginPage'
import { useAuth } from './features/auth/hooks/useAuth'
import { FinanceApp } from './pages/FinanceApp'

function App() {
  const auth = useAuth()

  if (auth.isCheckingAuth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f9fa] text-sm font-medium text-[#4b5563]">
        Carregando...
      </main>
    )
  }

  if (!auth.user) {
    return <LoginPage error={auth.error} isLoading={auth.isLoading} onLogin={auth.login} onRegister={auth.register} />
  }

  return <FinanceApp user={auth.user} onLogout={auth.logout} />
}

export default App

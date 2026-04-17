import { LoginPage } from './pages/LoginPage'
import { useAuth } from './features/auth/hooks/useAuth'
import { FinanceApp } from './pages/FinanceApp'

function App() {
  const auth = useAuth()

  if (!auth.user) {
    return <LoginPage onLogin={auth.login} onRegister={auth.register} />
  }

  return <FinanceApp user={auth.user} onLogout={auth.logout} />
}

export default App

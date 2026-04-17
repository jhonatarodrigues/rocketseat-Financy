import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { useAuth } from './features/auth/hooks/useAuth'

function App() {
  const auth = useAuth()

  if (!auth.user) {
    return <LoginPage onLogin={auth.login} onRegister={auth.register} />
  }

  return <DashboardPage user={auth.user} onLogout={auth.logout} />
}

export default App

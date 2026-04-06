import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './application/providers/AuthProvider'
import AppLayout from './presentation/components/AppLayout'
import LoginPage from './presentation/pages/LoginPage'
import RegisterPage from './presentation/pages/RegisterPage'
import JobsPage from './presentation/pages/JobsPage'
import CVPage from './presentation/pages/CVPage'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<JobsPage />} />
        <Route path="/cv" element={<CVPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

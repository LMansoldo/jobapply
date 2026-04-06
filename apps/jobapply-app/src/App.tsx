import { App as AntApp } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './application/providers/AuthProvider'
import AppRoutes from './routes'

export default function App() {
  return (
    <AntApp>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </AntApp>
  )
}

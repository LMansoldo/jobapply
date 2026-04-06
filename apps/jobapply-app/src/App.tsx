import { ConfigProvider, App as AntApp } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './application/providers/AuthProvider'
import AppRoutes from './routes'
import { antdTheme } from './styles/theme/antdTheme'

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}

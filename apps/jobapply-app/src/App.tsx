import { ConfigProvider, App as AntApp } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider, useAuth } from './application/providers/AuthProvider'
import { router } from './router'
import { queryClient } from './queryClient'
import { antdTheme } from './styles/theme/antdTheme'

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

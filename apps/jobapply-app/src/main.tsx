import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const isLanding = window.location.pathname === '/'

// Landing page: lightweight, no antd
const LandingOnly = React.lazy(() => import('./LandingOnly'))

// Full app: antd + all providers (lazy loaded for non-landing routes)
const FullApp = React.lazy(() => import('./AppWithProviders'))

function AppShell() {
  if (isLanding) {
    return (
      <Suspense fallback={null}>
        <LandingOnly />
      </Suspense>
    )
  }
  return (
    <Suspense fallback={null}>
      <FullApp />
    </Suspense>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
)

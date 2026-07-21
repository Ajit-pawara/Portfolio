import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { checkVersion } from './version-check.ts'
import ErrorBoundary from './ErrorBoundary.tsx'

try {
  const stored = localStorage.getItem('cyber_portfolio_db')
  if (stored) {
    JSON.parse(stored)
  }
} catch {
  localStorage.removeItem('cyber_portfolio_db')
}

checkVersion()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

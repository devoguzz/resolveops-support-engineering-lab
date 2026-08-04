import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/index.css'
import { getStoredState } from './store/demoDataStore'

// Ensure state is seeded in localStorage before rendering
getStoredState();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

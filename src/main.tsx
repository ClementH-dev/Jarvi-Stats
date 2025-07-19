import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAuth } from './lib/nhost'
import './index.css'
import App from './App.tsx'

// Initialisation de l'authentification Nhost
initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

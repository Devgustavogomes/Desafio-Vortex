import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Registrar Service Worker para habilitar funcionalidades PWA e Offline
registerSW({
  onNeedRefresh() {
    console.log('Nova atualização disponível!')
  },
  onOfflineReady() {
    console.log('App está pronto para funcionar offline!')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

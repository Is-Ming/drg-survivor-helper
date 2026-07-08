import React from 'react'
import { createRoot } from 'react-dom/client'
import { PreferencesProvider } from './theme/PreferencesContext'
import { App } from './App'
import { registerSW } from 'virtual:pwa-register'

// PWA：autoUpdate 静默后台更新（T11）
registerSW({ immediate: true })

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <React.StrictMode>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </React.StrictMode>,
)

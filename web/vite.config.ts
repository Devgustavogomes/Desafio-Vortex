import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.png'],
      manifest: {
        name: 'UNIFOR Circular Marketplace',
        short_name: 'UNIFOR Circular',
        description: 'Marketplace de Economia Circular do Campus da UNIFOR para doação e venda de materiais estudantis e acadêmicos',
        theme_color: '#047857',
        background_color: '#F8FAFC',
        display: 'standalone',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// En GitHub Pages la app vive en /TickNova/; el workflow lo indica con VITE_BASE.
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // "prompt": la nueva versión espera a que el usuario pulse "Actualizar" (AvisoPWA).
      registerType: 'prompt',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'TickNova',
        short_name: 'TickNova',
        description: 'Compra boletos para conciertos, teatro y deportes con código QR.',
        lang: 'es',
        start_url: base,
        scope: base,
        display: 'standalone',
        theme_color: '#504e76',
        background_color: '#fdf8e2',
        icons: [
          { src: 'icons/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache del app shell: HTML, JS, CSS e íconos (las fotos se guardan al verlas).
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        // Cualquier ruta de la SPA (por ejemplo /eventos/3) abre index.html, también sin conexión.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\/api\//],
        runtimeCaching: [
          {
            // API falsa: primero la red; si no hay conexión, la última respuesta guardada.
            urlPattern: ({ url }) => url.pathname.includes('/api/') && url.pathname.endsWith('.json'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ticknova-api',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 10 }
            }
          },
          {
            // Imágenes de eventos: primero la caché, porque no cambian.
            urlPattern: ({ request, url }) => request.destination === 'image' && url.pathname.includes('/img/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ticknova-imagenes',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'ticknova-fuentes-css' }
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'ticknova-fuentes',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
})

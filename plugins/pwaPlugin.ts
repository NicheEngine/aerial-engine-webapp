/**
 * Zero-config PWA for Vite
 * https://github.com/antfu/vite-plugin-pwa
 */
import { VitePWA } from 'vite-plugin-pwa'
import type { ViteEnv } from 'vite:env'

export function configPwaConfig(viteEnv: ViteEnv) {
  const { VITE_PLUGIN_PWA_USE, VITE_APP_TITLE, VITE_APP_SHORT_NAME } = viteEnv

  if (VITE_PLUGIN_PWA_USE) {
    // vite-plugins-pwa
    return VitePWA({
      manifest: {
        name: VITE_APP_TITLE,
        short_name: VITE_APP_SHORT_NAME,
        icons: [
          {
            src: './resource/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './resource/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    })
  }
  return []
}

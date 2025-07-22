import { createHtmlPagePlugin } from './vite-plugin-html-page'
import type { ViteEnv } from 'vite:env'

export function configHtmlPagePlugin(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_APP_TITLE } = viteEnv

  return createHtmlPagePlugin({
    minify: isBuild,
    pages: [
      {
        default: true,
        key: 'index',
        entry: '@/main.js',
        template: 'index.html',
        filename: 'index.html',
        inject: {
          data: {
            title: VITE_APP_TITLE,
          },
        },
      },
      // {
      //   key: 'home',
      //   entry: '@ps/home/home.js',
      //   template: 'home.html',
      //   filename: 'home.html',
      //   inject: {
      //     data: {
      //       title: VITE_APP_TITLE,
      //     },
      //   },
      // },
    ],
  })
}

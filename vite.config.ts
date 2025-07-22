import { fileURLToPath, URL } from 'node:url'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'

import colors from 'picocolors'
import pkg from './package.json'
import dayjs from 'dayjs'

import { createVitePlugins } from './plugins'
import { createProxy } from './plugins/serverProxy'
import APP_CONSTANTS from './plugins/constants'
import { wrapViteEnv } from './plugins/wrapViteEnvs'
import { PreRenderedAsset } from 'rollup'

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

// https://vite.dev/config/
export default defineConfig(({ command: VITE_COMMAND, mode: VITE_MODE }: ConfigEnv) => {
  const VITE_ROOT = process.cwd()
  const VITE_ENV = loadEnv(VITE_MODE, VITE_ROOT)
  console.log(colors.cyan(`✨ [VITE_COMMAND]: `), colors.green(`${VITE_COMMAND}`))
  console.log(colors.cyan(`✨ [VITE_MODE]   : `), colors.green(`${VITE_MODE}`))
  console.log(colors.cyan(`✨ [VITE_ENV]    : \n`), VITE_ENV)

  const viteEnv = wrapViteEnv(VITE_ENV)

  const __APP_ENV__ = viteEnv

  const {
    VITE_SERVER_WS_USE = true,
    VITE_SERVER_HTTPS_USE = true,
    VITE_SERVER_HOST_USE = true,
    VITE_SERVER_PORT = 8080,
    VITE_PUBLIC_PATH = '/',
    VITE_CONSOLE_LOG_DROP = true,
  } = viteEnv

  const isBuild = VITE_COMMAND === 'build'
  return {
    base: VITE_PUBLIC_PATH ?? '/',
    root: VITE_ROOT,
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: APP_CONSTANTS.APP_OUTPUT_NAME,
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      commonjsOptions: {
        ignoreTryCatch: false,
        exclude: ['node_modules/dagre'],
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: VITE_CONSOLE_LOG_DROP ?? true,
          drop_debugger: VITE_CONSOLE_LOG_DROP ?? true,
        },
      },
      rollupOptions: {
        output: {
          sanitizeFileName: (fileName: string) => {
            if (fileName.includes(':')) {
              return fileName.substring(fileName.lastIndexOf(':') + 1)
            } else {
              return fileName
            }
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames(assetInfo: PreRenderedAsset) {
            for (const name of assetInfo.names) {
              if (/\.(css|scss)$/.test(name)) {
                return `assets/css/[name]-[hash].[ext]`
              }
              if (/\.(ttf|woff|woff2|eot)$/.test(name)) {
                return `assets/font/[name].[hash].[ext]`
              }
              if (/\.(png|jpg|jpeg|svg|ico|webp)$/.test(name)) {
                return `assets/image/[name]-[hash].[ext]`
              }
              if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
                return `assets/media/[name].[hash][ext]`
              }
            }
            return `assets/[name]-[hash].[ext]`
          },
        },
      },
    },
    src: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __APP_ENV__: JSON.stringify(__APP_ENV__),
    },
    optimizeDeps: {
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        /**
         * @iconify/iconify: The dependency is dynamically
         * and virtually loaded by @purge-icons/generated,
         * so it needs to be specified explicitly
         */
        '@iconify/iconify',
        'ant-design-vue/locale/zh_CN',
        'ant-design-vue/locale/en_US',
      ],
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    server: {
      https: VITE_SERVER_HTTPS_USE ?? false,
      host: VITE_SERVER_HOST_USE ?? false,
      open: true,
      port: VITE_SERVER_PORT ?? 8080,
      proxy: createProxy(VITE_SERVER_WS_USE ?? false),
    },
    resolve: {
      extensions: ['.vue', '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        '@aps': fileURLToPath(new URL('./src/apis', import.meta.url)),
        '@ass': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@cps': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@dts': fileURLToPath(new URL('./src/directives', import.meta.url)),
        '@ems': fileURLToPath(new URL('./src/enums', import.meta.url)),
        '@ets': fileURLToPath(new URL('./src/extends', import.meta.url)),
        '@hks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@hts': fileURLToPath(new URL('./src/https', import.meta.url)),
        '@lys': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@lcs': fileURLToPath(new URL('./src/locales', import.meta.url)),
        '@lgs': fileURLToPath(new URL('./src/logics', import.meta.url)),
        '@mds': fileURLToPath(new URL('./src/models', import.meta.url)),
        '@pgs': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@rts': fileURLToPath(new URL('./src/routers', import.meta.url)),
        '@sts': fileURLToPath(new URL('./src/settings', import.meta.url)),
        '@srs': fileURLToPath(new URL('./src/stores', import.meta.url)),
        '@sls': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@tps': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@uts': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@vws': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@wds': fileURLToPath(new URL('./src/widgets', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  } as unknown as UserConfig
})

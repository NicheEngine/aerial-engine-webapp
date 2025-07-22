// vite-plugin-app-config

declare module 'app-config-plugin' {
  import { ViteEnv } from 'vite:env'

  export interface AppConfigOptions {
    configName: string
    configContext: ViteEnv
    configFileName: string
  }

  export interface AppConfigPluginOptions {
    src: string
    build: boolean
    scripts: Record<string, () => void>
    ignored: boolean
  }

  export {
    createAppBuildStartPlugin,
    createAppBuildEndPlugin,
    createAppHtmlPlugin,
    createAppServerPlugin,
    createAppConfigPlugin,
  } from './index.ts'
}

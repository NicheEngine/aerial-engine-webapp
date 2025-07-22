import { APP_CONFIG_NAME } from './constants.ts'
import script from '../scripts'
import pkg from '../package.json'
import type { ViteEnv } from 'vite:env'
import type { AppConfigPluginOptions } from 'app-config-plugin'
import { createAppConfigPlugin } from './vite-plugin-app-config'

export function configAppConfigPlugin(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_PUBLIC_PATH, VITE_LIB_CESIUM_USE, VITE_LIB_TIANDITU_USE, VITE_LIB_EASYPLAYER_USE } =
    viteEnv

  const PUBLIC_PATH = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`

  const appConfigSrc = () => {
    return `${PUBLIC_PATH || '/'}${APP_CONFIG_NAME}?v=${pkg.version}-${new Date().getTime()}`
  }

  const userOptions = {
    src: appConfigSrc(),
    build: isBuild,
    ignored: !isBuild,
    scripts: {},
  } as AppConfigPluginOptions

  if (VITE_LIB_CESIUM_USE) {
    userOptions.scripts['cesium'] = script.cesium
  }

  if (VITE_LIB_TIANDITU_USE) {
    userOptions.scripts['tianditu'] = script.tianditu
  }

  if (VITE_LIB_EASYPLAYER_USE) {
    userOptions.scripts['easyplayer'] = script.easyplayer
  }

  return createAppConfigPlugin(userOptions)
}

import { viteExternalsPlugin } from 'vite-plugin-externals'
import type { Plugin } from 'vite'

export function configExternalPlugin() {
  return viteExternalsPlugin({
    cesium: 'Cesium',
    '@easydarwin/easyplayer': 'EasyPlayer',
  }) as Plugin
}

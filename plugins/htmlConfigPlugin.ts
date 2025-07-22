import type { ViteEnv } from 'vite:env'
import createHtmlConfigPlugin from './vite-plugin-html-config'
import type { HtmlConfigPluginOptions, IHTMLTag, ScriptTag } from 'html-config-plugin'

export function configHtmlConfigPlugin(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_LIB_CESIUM_USE, VITE_LIB_TIANDITU_USE, VITE_LIB_EASYPLAYER_USE } = viteEnv

  const headScripts: ScriptTag[] = []
  const links: IHTMLTag[] = []

  VITE_LIB_CESIUM_USE &&
    headScripts.push({
      type: 'text/javascript',
      cesium: 'true',
      src: '/cesium/Cesium.js',
    })

  VITE_LIB_CESIUM_USE &&
    links.push({
      rel: 'stylesheet',
      cesium: 'true',
      href: '/cesium/Widgets/widgets.css',
    })

  VITE_LIB_TIANDITU_USE &&
    headScripts.concat([
      {
        type: 'text/javascript',
        cesium: 'true',
        src: '/tianditu/Cesium_ext_min.js',
      },
      {
        type: 'text/javascript',
        cesium: 'true',
        src: '/tianditu/bytebuffer.min.js',
      },
      {
        type: 'text/javascript',
        cesium: 'true',
        src: '/tianditu/long.min.js',
      },
      {
        type: 'text/javascript',
        cesium: 'true',
        src: '/tianditu/protobuf.min.js',
      },
    ])

  VITE_LIB_EASYPLAYER_USE &&
    headScripts.push({
      type: 'text/javascript',
      easyplayer: 'true',
      src: `/easyplayer/EasyPlayer-element.min.js`,
    })

  const htmlOptions: HtmlConfigPluginOptions = {
    build: isBuild,
    pages: {
      index: {
        headScripts,
        links,
      },
    },
  }
  return createHtmlConfigPlugin(htmlOptions)
}

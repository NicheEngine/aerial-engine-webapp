import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteLegacyPlugin from '@vitejs/plugin-legacy'

import VitePluginCertificate from 'vite-plugin-mkcert'

import createWindicssPlugin from 'vite-plugin-windicss'
import { configHtmlPagePlugin } from './htmlPagePlugin.ts'
import { configPwaConfig } from './pwaPlugin.ts'
import { configCompressPlugin } from './compressPlugin.ts'
import { configStyleImportPlugin } from './styleImportPlugin.ts'
import { configVisualizerConfig } from './visualizerPlugin.ts'
import { configImageminPlugin } from './imageMinPlugin.ts'
import { configSvgIconsPlugin } from './svgSpritePlugin.ts'
import { configExternalPlugin } from './externalPlugin.ts'
import { configHtmlConfigPlugin } from './htmlConfigPlugin.ts'
import { configAppConfigPlugin } from './appConfigPlugin.ts'

import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { ViteEnv } from 'vite:env'
import type { PluginOption } from 'vite'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean): PluginOption[] {
  const {
    VITE_PLUGIN_APP_CONFIG_USE = true,
    VITE_PLUGIN_WINDICSS_USE = true,
    VITE_PLUGIN_SVG_ICONS_USE = true,
    VITE_PLUGIN_IMAGEMIN_USE = true,
    VITE_PLUGIN_STYLE_IMPORT_USE = true,
    VITE_PLUGIN_VISUALIZER_USE = true,
    VITE_PLUGIN_LEGACY_USE = false,
    VITE_PLUGIN_PWA_USE = true,
    VITE_PLUGIN_COMPRESS_USE = true,
    VITE_BUILD_COMPRESS_TYPE = 'none',
    VITE_BUILD_COMPRESS_ORIGIN_FILE_DELETE = false,
  } = viteEnv

  const vitePlugins: PluginOption[] = [
    // have to
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'easy-player',
        },
      },
    }),
    // have to
    vueJsx(),
    // dev tools
    vueDevTools(),
    // vite-plugins-mkcert
    // 自动生成本地开发环境所需的自签名 SSL 证书
    VitePluginCertificate({
      source: 'coding',
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
        ElementPlusResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ]

  // vite-plugin-externals
  // vite 环境下 排除打包处理插件
  vitePlugins.push(configExternalPlugin())

  // vite-plugin-html-handle
  // 基于vite-plugin-html-config 改写的多页面支持插件
  vitePlugins.push(configHtmlConfigPlugin(viteEnv, isBuild))

  // // vite-plugins-html
  // // vite 环境下 html处理插件
  vitePlugins.push(configHtmlPagePlugin(viteEnv, isBuild))

  // vite-plugin-app-config
  // vite 环境下 app config 框架插件
  VITE_PLUGIN_APP_CONFIG_USE && vitePlugins.push(configAppConfigPlugin(viteEnv, isBuild))

  // vite-plugins-windicss
  // vite 环境下 windi css 框架插件
  VITE_PLUGIN_WINDICSS_USE && vitePlugins.push(createWindicssPlugin())

  // @vitejs/plugins-legacy
  // vite 环境下 旧版浏览器支持插件
  VITE_PLUGIN_LEGACY_USE && isBuild && vitePlugins.push(viteLegacyPlugin())

  // vite-plugins-svg-icons
  // vite 环境下 svg 图标支持
  VITE_PLUGIN_SVG_ICONS_USE && vitePlugins.push(configSvgIconsPlugin(isBuild))

  // vite-plugins-style-import
  // vite 环境下 根据需要自动导入 组件 的样式文件
  VITE_PLUGIN_STYLE_IMPORT_USE && vitePlugins.push(configStyleImportPlugin())

  // rollup-plugins-visualizer
  // vite 环境下 Rollup 构建工具生成可视化的构建报告
  VITE_PLUGIN_VISUALIZER_USE && vitePlugins.push(configVisualizerConfig())

  // The following plugins only work in the production environment
  if (isBuild) {
    // vite-plugins-imagemin
    //  vite 环境下 优化和压缩项目中的图片资源
    VITE_PLUGIN_IMAGEMIN_USE && vitePlugins.push(configImageminPlugin())

    // rollup-plugins-gzip
    // vite 环境下 Rollup 构建过程中自动压缩生成的文件
    VITE_PLUGIN_COMPRESS_USE &&
      vitePlugins.push(
        configCompressPlugin(VITE_BUILD_COMPRESS_TYPE, VITE_BUILD_COMPRESS_ORIGIN_FILE_DELETE),
      )

    // vite-plugins-pwa
    // vite 环境下 渐进式web离线缓存插件
    VITE_PLUGIN_PWA_USE && vitePlugins.push(configPwaConfig(viteEnv))
  }

  return vitePlugins
}

export default createVitePlugins

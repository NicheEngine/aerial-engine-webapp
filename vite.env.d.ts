/// <reference types="vite/client" />

declare interface ViteEnvMeta {
  VITE_APP_TITLE: string
  VITE_APP_NAME: string
  VITE_APP_SHORT_NAME: string

  VITE_APP_PRIMARY_COLOR: string
  VITE_APP_HEADER_THEME: string & ('dark' | 'light')
  VITE_APP_MENU_THEME: string & ('dark' | 'light')

  VITE_API_BASE_URL: string
  VITE_API_URL_PREFIX: string
  VITE_API_UPLOAD_URL: string

  VITE_PUBLIC_PATH: string
  VITE_SERVER_PORT: number
  VITE_SERVER_WS_USE: boolean
  VITE_SERVER_HTTPS_USE: boolean
  VITE_SERVER_HOST_USE: boolean

  VITE_CONSOLE_LOG_DROP: boolean

  VITE_SCRIPT_EASY_PLAYER_TYPE: string & ('component' | 'element')

  VITE_PLUGIN_MOCK_USE: boolean
  VITE_PLUGIN_PWA_USE: boolean
  VITE_PLUGIN_APP_CONFIG_USE: boolean
  VITE_PLUGIN_WINDICSS_USE: boolean
  VITE_PLUGIN_SVG_ICONS_USE: boolean
  VITE_PLUGIN_IMAGEMIN_USE: boolean
  VITE_PLUGIN_STYLE_IMPORT_USE: boolean
  VITE_PLUGIN_VISUALIZER_USE: boolean
  VITE_PLUGIN_LEGACY_USE: boolean
  VITE_PLUGIN_COMPRESS_USE: boolean

  VITE_BUILD_COMPRESS_TYPE: string & ('gzip' | 'brotli' | 'none')
  VITE_BUILD_COMPRESS_ORIGIN_FILE_DELETE: boolean

  VITE_LIB_CESIUM_USE: boolean
  VITE_LIB_EASYPLAYER_USE: boolean
  VITE_LIB_TIANDITU_USE: boolean

  VITE_LOCAL_3DTILE_URL: string
  VITE_CESIUM_BASE_URL: string
  VITE_TIANDITU_API_KEY: string
  VITE_TIANDITU_API_URL: string
  VITE_ARCGIS_IMAGERY_URL: string
}

declare interface ImportMetaEnv extends ViteEnvMeta {
  __: unknown
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

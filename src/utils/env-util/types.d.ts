declare module 'env-util' {
  export interface AppApiEnv {
    // Site title
    VITE_APP_TITLE: string
    // Project abbreviation
    VITE_APP_NAME: string
    // Project abbreviation
    VITE_APP_SHORT_NAME: string
    // Service interface url
    VITE_API_BASE_URL: string
    // Service interface url prefix
    VITE_API_URL_PREFIX?: string
    // Upload url
    VITE_API_UPLOAD_URL?: string
  }

  export {
    storagePrefix,
    shortName,
    appApiEnv,
    DEV_MODE,
    PROD_MODE,
    isDevMode,
    isProdMode,
  } from './index'
}

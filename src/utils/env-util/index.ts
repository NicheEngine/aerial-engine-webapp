import type { AppApiEnv } from 'env-util'

import { warn } from '@uts/logger.ts'
import pkg from '#/package.json'
import { wrapConfigName } from '#/plugins/wrapViteEnvs.ts'

export function storagePrefix() {
  const { VITE_APP_SHORT_NAME } = appApiEnv()
  return `${VITE_APP_SHORT_NAME}__${envMode()}`.toUpperCase()
}

// Generate cache key according to version
export function shortName() {
  return `${storagePrefix()}${`__${pkg.version}`}__`.toUpperCase()
}

export function appApiEnv() {
  const APP_ENV_NAME = wrapConfigName(import.meta.env)

  const APP_ENV = (import.meta.env.DEV
    ? // Get the global configuration
      // (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as AppApiEnv)
    : window[APP_ENV_NAME as any]) as unknown as AppApiEnv

  const {
    VITE_APP_TITLE,
    VITE_APP_NAME,
    VITE_APP_SHORT_NAME,
    VITE_API_BASE_URL,
    VITE_API_URL_PREFIX,
    VITE_API_UPLOAD_URL,
  } = APP_ENV

  if (!/^[a-zA-Z_]*$/.test(VITE_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    )
  }

  return {
    VITE_APP_TITLE,
    VITE_APP_NAME,
    VITE_APP_SHORT_NAME,
    VITE_API_BASE_URL,
    VITE_API_URL_PREFIX,
    VITE_API_UPLOAD_URL,
  }
}

export const DEV_MODE = 'development'

export const PROD_MODE = 'production'

export function envMode(): string {
  return import.meta.env.MODE
}

export function isDevMode(): boolean {
  return import.meta.env.DEV
}

export function isProdMode(): boolean {
  return import.meta.env.PROD
}

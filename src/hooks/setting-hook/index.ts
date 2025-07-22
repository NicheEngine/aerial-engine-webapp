import type { AppGlobSetting } from 'app-settings'

import { warn } from '@uts/logger.ts'
import { appApiEnv } from 'env-util'

export const useSettingHook = (): Readonly<AppGlobSetting> => {
  const {
    VITE_APP_TITLE,
    VITE_APP_NAME,
    VITE_APP_SHORT_NAME,
    VITE_API_BASE_URL,
    VITE_API_URL_PREFIX,
    VITE_API_UPLOAD_URL,
  } = appApiEnv()

  if (!/[a-zA-Z_]*/.test(VITE_APP_SHORT_NAME)) {
    warn(
      `VITE_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    )
  }

  // Take global configuration
  const glob: Readonly<AppGlobSetting> = {
    name: VITE_APP_NAME,
    title: VITE_APP_TITLE,
    apiUrl: VITE_API_BASE_URL,
    shortName: VITE_APP_SHORT_NAME,
    urlPrefix: VITE_API_URL_PREFIX,
    uploadUrl: VITE_API_UPLOAD_URL,
  }
  return glob as Readonly<AppGlobSetting>
}

import { isDevMode } from 'env-util'

/* System default cache time, in seconds */
export const DEFAULT_CACHE_TIME = 60 * 60 * 24

/* aes encrypt key 16 */
export const DEFAULT_CACHE_CIPHER = {
  key: 'xfTemplateAdmin@',
  iv: '@xfTemplateAdmin',
}

/* Whether the system cache is encrypted using aes */
export const ENABLE_STORAGE_ENCRYPT = !isDevMode()

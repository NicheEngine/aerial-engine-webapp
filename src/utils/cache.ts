import { Persistent } from 'persistent-extend'
import type { BasicKeys } from 'persistent-extend'
import { CacheType } from '@ems/cacheTypes'
import { PROJECT_SETTING } from 'app-settings'
import { ACCESS_TOKEN_KEY } from '@ems/cacheTypes'

const { purviewCacheType } = PROJECT_SETTING
const isLocal = purviewCacheType === CacheType.LOCAL

export function getAccessToken() {
  return getCache(ACCESS_TOKEN_KEY)
}

export function getCache<T>(key: BasicKeys) {
  const persistent = isLocal ? Persistent.getLocal : Persistent.getSession
  return persistent(key) as T
}

export function setCache(key: BasicKeys, value: any) {
  const persistent = isLocal ? Persistent.setLocal : Persistent.setSession
  return persistent(key, value, true)
}

export function clearCache(immediate = true) {
  const persistent = isLocal ? Persistent.clearLocal : Persistent.clearSession
  return persistent(immediate)
}

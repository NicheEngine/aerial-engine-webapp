import { shortName } from 'env-util'
import { createWebStorage } from 'storage-extend'
import type { StorageOptions } from 'storage-extend'
import { DEFAULT_CACHE_TIME, ENABLE_STORAGE_ENCRYPT } from 'app-settings'

const createOptions = (storage: Storage, options: StorageOptions = {}): StorageOptions => {
  return {
    // No encryption in debug mode
    isEncrypt: ENABLE_STORAGE_ENCRYPT,
    storage,
    prefix: shortName(),
    ...options,
  }
}

export const webStorage = createWebStorage(createOptions(sessionStorage))

export const createStorage = (storage: Storage = sessionStorage, options: StorageOptions = {}) => {
  return createWebStorage(createOptions(storage, options))
}

export const createSessionStorage = (options: StorageOptions = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export const createLocalStorage = (options: StorageOptions = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export default webStorage

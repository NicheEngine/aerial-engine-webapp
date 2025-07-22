import { DEFAULT_CACHE_CIPHER } from 'app-settings'
import { EncryptAes } from 'encrypt-extend'
import { isNullOrUndefined } from '@uts/staple.ts'
import type { StorageParams } from 'storage-extend'

export const createWebStorage = ({
  prefix = '',
  storage = sessionStorage,
  key = DEFAULT_CACHE_CIPHER.key,
  iv = DEFAULT_CACHE_CIPHER.iv,
  timeout = null,
  isEncrypt = true,
}: Partial<StorageParams> = {}) => {
  if (isEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When isEncrypt is true, the key or iv must be 16 bits!')
  }

  const encrypt = new EncryptAes({ key, iv })

  /**
   * Cache class Construction parameters can be passed into sessionStorage, localStorage,
   */
  const WebStorage = class WebStorage {
    private storage: Storage
    private prefix?: string
    private encrypt: EncryptAes
    private readonly isEncrypt: boolean

    constructor() {
      this.storage = storage
      this.prefix = prefix
      this.encrypt = encrypt
      this.isEncrypt = isEncrypt
    }

    private getKey(key: string) {
      return `${this.prefix}${key}`.toUpperCase()
    }

    /**
     * Set cache
     */
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUndefined(expire) ? new Date().getTime() + expire * 1000 : null,
      })
      const stringifyValue = this.isEncrypt ? this.encrypt.encryptOfAes(stringData) : stringData
      this.storage.setItem(this.getKey(key), stringifyValue)
    }

    /**
     * Read cache
     */
    get(key: string, define: any = null): any {
      const val = this.storage.getItem(this.getKey(key))
      if (!val) return define

      try {
        const decVal = this.isEncrypt ? this.encrypt.decryptOfAes(val) : val
        const data = JSON.parse(decVal)
        const { value, expire } = data
        if (isNullOrUndefined(expire) || expire >= new Date().getTime()) {
          return value
        }
        this.remove(key)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return define
      }
    }

    /**
     * Delete cache based on key
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key))
    }

    /**
     * Delete all caches of this instance
     */
    clear(): void {
      this.storage.clear()
    }
  }
  return new WebStorage()
}

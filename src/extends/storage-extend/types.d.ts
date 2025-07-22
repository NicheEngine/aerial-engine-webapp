declare module 'storage-extend' {
  import type { EncryptOptions } from 'encrypt-extend'

  export interface StorageParams extends EncryptOptions {
    prefix: string
    storage: Storage
    isEncrypt: boolean
    timeout?: Nullable<number>
  }

  export type StorageOptions = Partial<StorageParams>

  export { createWebStorage } from './storage.ts'

  export { createStorage, createSessionStorage, createLocalStorage, webStorage } from './index.ts'
}

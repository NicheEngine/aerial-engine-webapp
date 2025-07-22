declare module 'encrypt-extend' {
  export { EncryptAes } from './EncryptAes.ts'
  export interface EncryptOptions {
    key: string | undefined
    iv: string | undefined
  }
}

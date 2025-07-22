import UTF8, { parse } from 'crypto-js/enc-utf8'
import ECB from 'crypto-js/mode-ecb'
import pkcs7 from 'crypto-js/pad-pkcs7'
import { decrypt, encrypt } from 'crypto-js/aes'
import type { EncryptOptions } from 'encrypt-extend'

export class EncryptAes {
  private key: CryptoJS.lib.WordArray = {} as CryptoJS.lib.WordArray
  private readonly iv: CryptoJS.lib.WordArray = {} as CryptoJS.lib.WordArray

  constructor(options: Partial<EncryptOptions> = {}) {
    const { key, iv } = options
    if (key) {
      this.key = parse(key)
    }
    if (iv) {
      this.iv = parse(iv)
    }
  }

  optionsOfAes() {
    return {
      mode: ECB,
      padding: pkcs7,
      iv: this.iv,
    }
  }

  encryptOfAes(cipher: string): string {
    return encrypt(cipher, this.key, this.optionsOfAes()).toString()
  }

  decryptOfAes(cipher: string): string {
    return decrypt(cipher, this.key, this.optionsOfAes()).toString(UTF8)
  }
}

export default EncryptAes

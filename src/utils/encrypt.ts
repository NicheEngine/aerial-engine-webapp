import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'
import md5 from 'crypto-js/md5'

export function encryptOfBase64(cipher: string): string {
  return UTF8.parse(cipher).toString(Base64)
}

export function decryptOfBase64(cipher: string): string {
  return Base64.parse(cipher).toString(UTF8)
}

export function passwordOfMd5(password: string): string {
  return md5(password).toString()
}

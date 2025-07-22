declare module 'axios-https' {
  import { InternalAxiosRequestConfig } from 'axios'
  import type { HttpOptions } from 'app-https'

  export { AxiosHandler } from '@hts/axios-https/AxiosHandler'
  export { AxiosCanceler } from '@hts/axios-https/AxiosCanceler'
  export { AxiosRetry } from '@hts/axios-https/AxiosRetry'
  export { AxiosObject } from '@hts/axios-https/AxiosObject'

  export interface AxiosOptions extends InternalAxiosRequestConfig {
    authScheme?: string
    httpHandler?: AxiosHandler
    httpOptions?: HttpOptions
  }

  export { httpStatus } from './httpStatus.ts'

  export { axiosHttp } from './index.ts'
}

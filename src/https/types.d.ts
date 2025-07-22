declare module 'app-https' {
  export * from 'axios-https'

  export type HttpErrorMode = 'none' | 'modal' | 'message' | undefined

  export interface HttpOptions {
    // Splicing request parameters to url
    joinParamsToUrl?: boolean
    // Format request parameter time
    formatDate?: boolean
    // Whether to process the request result
    isTransformResponse?: boolean
    // Whether to return native response headers
    // For example: use this attribute when you need to get the response headers
    isReturnNativeResponse?: boolean
    // Whether to join url
    joinPrefix?: boolean
    // Interface address, use the default apiUrl if you leave it blank
    apiUrl?: string
    // 请求拼接路径
    urlPrefix?: string
    // Error message prompt type
    errorMode?: HttpErrorMode
    // Whether to add a timestamp
    joinTime?: boolean
    ignoreCancelToken?: boolean
    // Whether to send token in header
    withToken?: boolean
    // 请求重试机制
    retryRequest?: HttpRetry
  }

  export interface HttpResult<T = any> {
    code?: number
    status?: number
    type: 'success' | 'error' | 'warning'
    message: string
    data: T
  }

  export interface HttpRetry {
    isOpenRetry: boolean
    count: number
    waitTime: number
  }

  export interface HttpMultifile {
    // Other parameters
    data?: Recordable
    // File parameter interface field name
    name?: string
    // file name
    file: File | Blob
    // file name
    filename?: string
    [key: string]: any
  }

  export enum ResultType {
    SUCCESS = 0,
    ERROR = -1,
    TIMEOUT = 401,
    TYPE = 'success',
  }

  export enum MethodType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
  }

  export enum ContentType {
    // json
    APPLICATION_JSON = 'application/json;charset=UTF-8',
    // form-data qs
    X_WWW_FORM_FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  upload
    MULTIPART_FORM_DATA = 'multipart/form-data;charset=UTF-8',
  }
}

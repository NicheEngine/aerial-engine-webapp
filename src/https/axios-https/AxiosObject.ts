import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { HttpOptions, HttpResult, HttpMultifile } from 'app-https'
import type { AxiosOptions } from 'axios-https'
import axios from 'axios'
import qs from 'qs'
import { AxiosCanceler } from 'axios-https'
import { isFunction } from '@uts/staple'
import { cloneDeep } from 'lodash-es'
import { METHOD_TYPE, CONTENT_TYPE } from 'app-https'

export class AxiosObject {
  private instance: AxiosInstance
  private readonly options: AxiosOptions

  constructor(options: AxiosOptions) {
    this.options = options
    this.instance = axios.create(options)
    this.setupHttpInterceptor()
  }

  private createAxios(options: AxiosOptions): void {
    this.instance = axios.create(options)
  }

  private getHttpHandler() {
    const { httpHandler } = this.options
    return httpHandler
  }

  getInstance(): AxiosInstance {
    return this.instance
  }

  configAxios(options: AxiosOptions) {
    if (!this.instance) {
      return
    }
    this.createAxios(options)
  }

  setHeaders(headers: any): void {
    if (!this.instance) {
      return
    }
    Object.assign(this.instance.defaults.headers, headers)
  }

  private setupHttpInterceptor() {
    const httpHandler = this.getHttpHandler()
    if (!httpHandler) {
      return
    }
    const {
      requestInterceptor,
      requestErrorInterceptor,
      responseInterceptor,
      responseErrorInterceptor,
    } = httpHandler

    const axiosCanceler = AxiosCanceler.default()

    // Request interceptor configuration processing
    this.instance.interceptors.request.use((requestConfig: InternalAxiosRequestConfig<any>) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      // @ts-ignore
      const { ignoreCancelToken } = requestConfig.httpOptions
      const ignoreCancel =
        ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.httpOptions?.ignoreCancelToken

      !ignoreCancel && axiosCanceler.cache(requestConfig)
      if (requestInterceptor && isFunction(requestInterceptor)) {
        requestConfig = requestInterceptor(requestConfig, this.options.httpOptions)
      }
      return requestConfig
    }, undefined)

    // Request interceptor error capture
    requestErrorInterceptor &&
      isFunction(requestErrorInterceptor) &&
      this.instance.interceptors.request.use(undefined, requestErrorInterceptor)

    // Response result interceptor processing
    this.instance.interceptors.response.use((response: AxiosResponse<any>) => {
      response && axiosCanceler.remove(response.config)
      if (responseInterceptor && isFunction(responseInterceptor)) {
        response = responseInterceptor(response)
      }
      return response
    }, undefined)

    // Response result interceptor error capture
    responseErrorInterceptor &&
      isFunction(responseErrorInterceptor) &&
      this.instance.interceptors.response.use(undefined, (error) => {
        // @ts-ignore
        return responseErrorInterceptor(this.instance, error)
      })
  }

  uploadFile<T = any>(requestConfig: InternalAxiosRequestConfig<any>, params: HttpMultifile) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data![key])
      })
    }

    return this.instance.request<T>({
      ...requestConfig,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': CONTENT_TYPE.X_WWW_FORM_FORM_URLENCODED,
        // @ts-ignore
        ignoreCancelToken: true,
      },
    })
  }

  // support form-data
  supportFormData(requestConfig: InternalAxiosRequestConfig<any>) {
    const headers = requestConfig.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== CONTENT_TYPE.X_WWW_FORM_FORM_URLENCODED ||
      !Reflect.has(requestConfig, 'data') ||
      requestConfig.method?.toUpperCase() === METHOD_TYPE.GET
    ) {
      return requestConfig
    }

    return {
      ...requestConfig,
      data: qs.stringify(requestConfig.data, { arrayFormat: 'brackets' }),
    }
  }

  get<T = any>(requestConfig: InternalAxiosRequestConfig<any>, options?: HttpOptions): Promise<T> {
    return this.request({ ...requestConfig, method: 'GET' }, options)
  }

  post<T = any>(requestConfig: InternalAxiosRequestConfig<any>, options?: HttpOptions): Promise<T> {
    return this.request({ ...requestConfig, method: 'POST' }, options)
  }

  put<T = any>(requestConfig: InternalAxiosRequestConfig<any>, options?: HttpOptions): Promise<T> {
    return this.request({ ...requestConfig, method: 'PUT' }, options)
  }

  delete<T = any>(
    requestConfig: InternalAxiosRequestConfig<any>,
    options?: HttpOptions,
  ): Promise<T> {
    return this.request({ ...requestConfig, method: 'DELETE' }, options)
  }

  request<T = any>(config: InternalAxiosRequestConfig<any>, options?: HttpOptions): Promise<T> {
    let axiosOptions: AxiosOptions = cloneDeep(config)
    const httpHandler = this.getHttpHandler()

    const { httpOptions } = this.options

    const assignOptions: HttpOptions = Object.assign({}, httpOptions, options)

    const { requestHandler, requestErrorHandler, responseHandler } = httpHandler || {}
    if (requestHandler && isFunction(requestHandler)) {
      axiosOptions = requestHandler(axiosOptions, assignOptions)
    }
    axiosOptions.httpOptions = assignOptions

    axiosOptions = this.supportFormData(axiosOptions)

    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<HttpResult>>(axiosOptions)
        .then((response: AxiosResponse<HttpResult>) => {
          if (responseHandler && isFunction(responseHandler)) {
            try {
              const result = responseHandler(response, assignOptions)
              resolve(result)
            } catch (error) {
              reject(error || new Error('request error!'))
            }
            return
          }
          resolve(response as unknown as Promise<T>)
        })
        .catch((error: Error | AxiosError) => {
          if (requestErrorHandler && isFunction(requestErrorHandler)) {
            reject(requestErrorHandler(error, assignOptions))
            return
          }
          if (axios.isAxiosError(error)) {
            // rewrite error message from axios in here
          }
          reject(error)
        })
    })
  }
}

export default AxiosObject;

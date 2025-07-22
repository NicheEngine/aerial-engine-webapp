import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { HttpOptions, HttpResult } from 'app-https'
import type { AxiosOptions } from 'axios-https'

export abstract class AxiosHandler {

  /**
   * 请求之前的拦截器处理
   */
  requestHandler?: (
    config: InternalAxiosRequestConfig,
    options: HttpOptions,
  ) => InternalAxiosRequestConfig

  /**
   * 请求失败处理
   */
  requestErrorHandler?: (error: Error, options: HttpOptions) => Promise<any>

  /**
   * 请求之前的拦截器
   */
  requestInterceptor?: (
    config: InternalAxiosRequestConfig<any>,
    options: AxiosOptions,
  ) => InternalAxiosRequestConfig<any>

  /**
   * 请求之前的拦截器错误处理
   */
  requestErrorInterceptor?: (error: Error) => void

  /**
   * 处理响应数据
   */
  responseHandler?: (response: AxiosResponse<HttpResult>, options: HttpOptions) => any

  /**
   * 请求失败处理
   */
  responseErrorHandler?: (error: Error, options: HttpOptions) => Promise<any>

  /**
   * 请求之后的拦截器
   */
  responseInterceptor?: (response: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * 请求之后的拦截器错误处理
   */
  responseErrorInterceptor?: (response: AxiosResponse<any>, error: Error) => void
}

export default AxiosHandler

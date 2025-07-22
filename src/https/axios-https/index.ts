// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { HttpOptions, HttpResult } from 'app-https'
import { MethodType, ResultType, ContentType } from 'app-https'
import type { AxiosOptions } from 'axios-https'
import { AxiosObject, AxiosHandler, AxiosRetry, httpStatus } from 'axios-https'

import { useI18nHook } from 'i18n-hook'
import { useSettingHook } from 'setting-hook'
import { useMessageHook } from 'message-hook'

import { isString } from '@uts/staple'
import { getAccessToken } from '@uts/cache'
import { urlParams, deepMerge } from '@uts/common'
import { joinTimestamp, formatRequestDate } from '@uts/date'

import { useUserStore } from 'user-store'
import { useErrorLogStore } from 'error-log-store'
import { clone } from 'lodash-es'


const globSetting = useSettingHook()
const urlPrefix = globSetting.urlPrefix
const { createMessage, createErrorModal } = useMessageHook()

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const handler: AxiosHandler = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  responseHandler: (response: AxiosResponse<HttpResult>, options: HttpOptions) => {
    const { t } = useI18nHook()
    const { isTransformResponse, isReturnNativeResponse } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return response
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return response.data
    }
    // 错误的时候返回

    const responseDate: HttpResult = response.data
    if (!responseDate) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'))
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, status, data, message } = responseDate

    // 这里逻辑可以根据项目进行修改
    const isSuccess = data && ((Reflect.has(data, 'status') && status === ResultType.SUCCESS) || (Reflect.has(data, 'code') && code === ResultType.SUCCESS))
    if (isSuccess) {
      return data
    }

    const codeStatus = status || code

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMessage = ''
    switch (codeStatus) {
      case ResultType.TIMEOUT:
        timeoutMessage = t('sys.api.timeoutMessage')
        const userStore = useUserStore()
        userStore.setAccessToken(undefined)
        userStore.asyncUserLogout(true)
        break
      default:
        if (message) {
          timeoutMessage = message
        }
    }

    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMessage })
    } else if (options.errorMode === 'message') {
      createMessage.error(timeoutMessage).then(() => {
      })
    }

    throw new Error(timeoutMessage || t('sys.api.apiRequestFailed'))
  },

  /**
   * 请求之前的拦截器处理
   */
  requestHandler: (config: InternalAxiosRequestConfig, options: HttpOptions) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === MethodType.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = urlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * 请求拦截器处理
   */
  requestInterceptor: (config: InternalAxiosRequestConfig, options: AxiosOptions) => {
    // 请求之前处理config
    const accessToken = getAccessToken()
    if (accessToken && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      ;(config as Recordable).headers.Authorization = options.authScheme
        ? `${options.authScheme} ${accessToken}`
        : accessToken
    }
    return config
  },

  /**
   * 响应拦截器处理
   */
  responseInterceptor: (response: AxiosResponse<any>) => {
    return response
  },

  /**
   * 响应错误处理
   */
  responseErrorInterceptor: (axiosInstance: AxiosResponse, error: any) => {
    const { t } = useI18nHook()
    const errorLogStore = useErrorLogStore()
    errorLogStore.addAjaxErrorInfo(error)
    const { response, code, message, config } = error || {}
    const errorMode = config?.requestOptions?.errorMode || 'none'
    const messageValue: string = response?.data?.error?.message ?? ''
    const errorValue: string = error?.toString?.() ?? ''
    let errorMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errorMessage = t('sys.api.apiTimeoutMessage')
      }
      if (errorValue?.includes('Network Error')) {
        errorMessage = t('sys.api.networkExceptionMsg')
      }

      if (errorMessage) {
        if (errorMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errorMessage })
        } else if (errorMode === 'message') {
          createMessage.error(errorMessage).then(() => {
          })
        }
        return Promise.reject(error)
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }

    httpStatus(error?.response?.status, messageValue, errorMode)

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry()
    const { isOpenRetry } = config.requestOptions.retryRequest
    config.method?.toUpperCase() === MethodType.GET &&
    isOpenRetry &&
    // @ts-ignore
    retryRequest.retry(axiosInstance, error)
    return Promise.reject(error)
  }
}

function createAxios(options?: Partial<AxiosOptions>) {
  return new AxiosObject(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // auth schemes，e.g: Bearer
        // authScheme: 'Bearer',
        authScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentType.APPLICATION_JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        httpHandler: clone(handler),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        httpOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // 重试
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100
          }
        } as HttpOptions
      } as AxiosOptions,
      options || {}
    )
  )
}

export const axiosHttp = createAxios()

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });

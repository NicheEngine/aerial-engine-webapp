import type { AxiosInstance, AxiosResponse } from 'axios';

import type { AxiosHttpConfigOptions, AxiosHttpRequestConfig } from './types';

import { $t } from '@engine/locales';
import {
  cloneDeep,
  isFunction,
  isObject,
  isString,
  merge,
} from '@engine/utils';

import axios from 'axios';

import AxiosHandler from './AxiosHandler';
import AxiosObject from './AxiosObject';
import AxiosRetry from './AxiosRetry';

function urlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters;
}

function joinTimestamp(join: boolean, restful = false): object | string {
  if (!join) {
    return restful ? '' : {};
  }
  const now = Date.now();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

function formatRequestDate(params: Record<string, any>) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return;
  }

  for (const key in params) {
    const format = params[key]?.format ?? null;
    if (format && typeof format === 'function') {
      params[key] = params[key].format('YYYY-MM-DD HH:mm:ss');
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

const authTokenHandler = async (axiosObject: AxiosObject, error: any) => {
  const axiosConfig = axiosObject.axiosConfig();
  const { config } = error;
  const { authenticate, refreshToken, isRefreshToken, formatToken } =
    axiosConfig.authToken;
  // 判断是否启用了 refreshToken 功能
  // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
  if (!isRefreshToken || config.__isRetryRequest) {
    await authenticate();
    return Promise.reject(error);
  }
  // 如果正在刷新 token，则将请求加入队列，等待刷新完成
  if (axiosObject.isRefreshing) {
    return new Promise((resolve) => {
      axiosObject.refreshTokenQueue.push((newToken: string) => {
        config.headers.Authorization = formatToken(newToken);
        resolve(axiosObject.request(config));
      });
    });
  }

  // 标记开始刷新 token
  axiosObject.isRefreshing = true;
  // 标记当前请求为重试请求，避免无限循环
  config.__isRetryRequest = true;

  try {
    const newToken = await refreshToken();
    // 处理队列中的请求
    axiosObject.refreshTokenQueue.forEach((callback) => callback(newToken));
    axiosObject.refreshTokenQueue = [];
    return axiosObject.request({ ...config });
  } catch (refreshError) {
    // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
    axiosObject.refreshTokenQueue.forEach((callback) => callback(''));
    axiosObject.refreshTokenQueue = [];
    console.error('Refresh token failed, please login again.');
    await authenticate();
    return Promise.reject(refreshError);
  } finally {
    axiosObject.isRefreshing = false;
  }
};

const handler: AxiosHandler = {
  beforeResponseHandler: (
    config: AxiosHttpRequestConfig,
    response: AxiosResponse<any>,
  ) => {
    const { data: axiosResult, status } = response;
    const {
      statusField = 'status',
      dataField = 'data',
      successStatus = 200,
      resultType = 'body',
    } = config?.result || {};
    const isNativeResponse =
      config.options?.isNativeResponse || resultType === 'raw';
    if (isNativeResponse) {
      return response;
    }

    if (status >= 200 && status < 400) {
      if (config.result?.resultType === 'body') {
        return axiosResult;
      } else if (
        isFunction(successStatus)
          ? successStatus(axiosResult[statusField])
          : axiosResult[statusField] === successStatus
      ) {
        return isFunction(dataField)
          ? dataField(axiosResult)
          : axiosResult[dataField];
      }
    }
    throw Object.assign({}, response, { response });
  },

  beforeRequestHandler: (config: AxiosHttpRequestConfig) => {
    const options: AxiosHttpConfigOptions = config.options || {};
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === 'GET') {
      if (isString(params)) {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      } else {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false),
        );
      }
    } else {
      if (isString(params)) {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      } else {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = urlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      }
    }
    return config;
  },

  doRequestHandler: (config: AxiosHttpRequestConfig) => {
    const { tokenPrefix, accessToken } = config.authToken;
    const currentToken = accessToken();
    if (currentToken && config?.options?.withToken !== false) {
      config.headers.Authorization = tokenPrefix
        ? `${tokenPrefix} ${currentToken}`
        : currentToken;
    }
    return config;
  },

  doResponseHandler: (
    config: AxiosHttpRequestConfig<any>,
    response: AxiosResponse<any>,
  ) => {
    const isTransformResponse = config.options?.isTransformResponse || false;
    if (!isTransformResponse) {
      return response.data;
    }
    return response;
  },

  afterResponseErrorHandler: async (
    axiosObject: AxiosObject,
    axiosInstance: AxiosInstance,
    error: any,
  ) => {
    const axiosConfig = axiosObject.axiosConfig();
    const { config, response } = error;
    const { unauthorizedStatus = [401] } = axiosConfig.authToken;

    axiosConfig.authToken;

    const status = response?.status || 500;
    if (unauthorizedStatus.includes(status)) {
      return await authTokenHandler(axiosObject, error);
    }
    // 添加自动重试机制 保险起见 只针对GET请求
    const axiosRetry = new AxiosRetry();
    const { isRetry = true } = config.httpRetry || {};
    if (config.method?.toUpperCase() === 'GET' && isRetry) {
      return await axiosRetry.retry(axiosInstance, axiosConfig, error);
    }
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const messageError: string = error?.toString?.() ?? '';
    let message = '';
    if (messageError?.includes('Network Error')) {
      message = $t('ui.fallback.http.networkError');
    } else if (error?.message?.includes?.('timeout')) {
      message = $t('ui.fallback.http.requestTimeout');
    }

    const { messageHandler } = axiosConfig.result || {};
    if (message && messageHandler) {
      messageHandler(message, error);
      return Promise.reject(error);
    }

    switch (status) {
      case 400: {
        message = $t('ui.fallback.http.badRequest');
        break;
      }
      case 401: {
        message = $t('ui.fallback.http.unauthorized');
        break;
      }
      case 403: {
        message = $t('ui.fallback.http.forbidden');
        break;
      }
      case 404: {
        message = $t('ui.fallback.http.notFound');
        break;
      }
      case 408: {
        message = $t('ui.fallback.http.requestTimeout');
        break;
      }
      default: {
        message = $t('ui.fallback.http.internalServerError');
      }
    }
    if (message && messageHandler) {
      messageHandler(message, error);
    }
    return Promise.reject(error);
  },
};

function createAxios(options?: Partial<AxiosHttpRequestConfig>) {
  return new AxiosObject(
    // 深度合并
    merge(
      {
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        handler: cloneDeep(handler),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        authToken: {
          // tokenPrefix，e.g: Bearer
          // tokenPrefix: 'Bearer',
          tokenPrefix: 'Bearer',
        },
        // 重试
        httpRetry: {
          isRetry: true,
          count: 3,
          waitTime: 100,
        },
        options: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: false,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 接口地址
          apiUrl: import.meta.env.BASE_URL,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        } as AxiosHttpConfigOptions,
      } as AxiosHttpRequestConfig,
      options || {},
    ),
  );
}

export { createAxios };

export * from './AxiosCanceler';
export * from './AxiosHandler';
export * from './AxiosObject';
export * from './AxiosRetry';
export type * from './types';

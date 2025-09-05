import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import type {
  AxiosHttpConfigOptions,
  AxiosHttpDataRecord,
  AxiosHttpMultifile,
  AxiosHttpRequestConfig,
  AxiosHttpResult,
  AxiosSerializeOptions,
} from './types';

import { bindMethods, cloneDeep, isFunction, isString } from '@engine/utils';

import axios from 'axios';
import qs from 'qs';

import AxiosCanceler from './AxiosCanceler';

const serializeParams = (
  serialize: AxiosSerializeOptions['paramsSerializer'],
) => {
  if (isString(serialize)) {
    switch (serialize) {
      case 'brackets': {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'brackets' });
      }
      case 'comma': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'comma' });
      }
      case 'indices': {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'indices' });
      }
      case 'repeat': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'repeat' });
      }
    }
  }
  return serialize;
};

class AxiosObject {
  public isRefreshing = false;
  public refreshTokenQueue: ((token: string) => void)[] = [];
  private readonly config: AxiosHttpRequestConfig;
  private instance: AxiosInstance;

  constructor(config: AxiosHttpRequestConfig) {
    config.paramsSerializer = serializeParams(
      config.serialize?.paramsSerializer,
    );
    this.config = config;
    this.instance = axios.create(config);
    bindMethods(this);
    this.setupHttpInterceptor();
  }

  axiosConfig(): AxiosHttpRequestConfig {
    return this.config;
  }

  configAxios(config: AxiosHttpRequestConfig) {
    if (!this.instance) {
      return;
    }
    this.createAxios(config);
  }

  delete<T = any>(config: AxiosHttpRequestConfig<any>): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  download<T = any>(config: AxiosHttpRequestConfig<any>): Promise<T> {
    const axiosConfig = Object.assign(
      {
        serialize: {
          resultType: 'body',
        },
        responseType: 'blob',
      },
      config,
    );
    return this.request({ ...axiosConfig, method: 'GET' });
  }

  get<T = any>(config: AxiosHttpRequestConfig<any>): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  post<T = any>(config: AxiosHttpRequestConfig<any>): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosHttpRequestConfig<any>): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  request<T>(config: AxiosHttpRequestConfig<any>): Promise<T> {
    let axiosConfig: AxiosHttpRequestConfig = cloneDeep(config);
    const axiosHandler = this.config.handler;

    const assignOptions: AxiosHttpConfigOptions = Object.assign(
      {},
      this.config.options,
      config.options,
    );

    axiosConfig = {
      options: assignOptions,
      ...axiosConfig,
      ...(axiosConfig.paramsSerializer
        ? { paramsSerializer: serializeParams(config.paramsSerializer) }
        : {}),
    };

    const {
      afterRequestErrorHandler,
      beforeRequestHandler,
      beforeResponseHandler,
    } = axiosHandler || {};
    if (beforeRequestHandler && isFunction(beforeRequestHandler)) {
      axiosConfig = beforeRequestHandler(config);
    }
    axiosConfig.options = assignOptions;

    axiosConfig = this.supportFormData(axiosConfig);

    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<AxiosHttpResult>>(axiosConfig)
        .then((response: AxiosResponse<AxiosHttpResult>) => {
          if (beforeResponseHandler && isFunction(beforeResponseHandler)) {
            try {
              const result = beforeResponseHandler(axiosConfig, response);
              resolve(result);
            } catch (error) {
              reject(error || new Error('request error!'));
            }
            return;
          }
          resolve(response as unknown as T);
        })
        .catch((error: AxiosError | Error) => {
          if (
            afterRequestErrorHandler &&
            isFunction(afterRequestErrorHandler)
          ) {
            reject(afterRequestErrorHandler(error, axiosConfig));
            return;
          }
          if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
          }
          reject(error);
        });
    });
  }

  setHeaders(headers: any): void {
    if (!this.instance) {
      return;
    }
    Object.assign(this.instance.defaults.headers, headers);
  }

  // support form-data
  supportFormData(config: AxiosHttpRequestConfig<any>) {
    const headers = config.headers || this.config.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== 'application/x-www-form-urlencoded;charset=utf-8' ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  upload<T = any>(
    config: AxiosHttpRequestConfig<any>,
    params: AxiosHttpMultifile,
  ) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }
    const fileData = params.data as AxiosHttpDataRecord;
    if (fileData) {
      Object.keys(fileData).forEach((key) => {
        const value = fileData?.[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }
        formData.append(key, fileData?.[key]);
      });
    }

    return this.instance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': 'multipart/form-data;charset=utf-8',
        ignoreCancelToken: true,
        ...config?.headers,
      },
    });
  }

  private createAxios(config: AxiosHttpRequestConfig): void {
    this.instance = axios.create(config);
  }

  private setupHttpInterceptor() {
    const axiosHandler = this.config.handler;
    if (!axiosHandler) {
      return;
    }
    const {
      afterResponseErrorHandler,
      doRequestErrorHandler,
      doRequestHandler,
      doResponseHandler,
    } = axiosHandler;

    const axiosCanceler = AxiosCanceler.default();

    // Request interceptor configuration processing
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const ignoreCancelToken = this.config.options?.ignoreCancelToken;
        const ignoreCancel =
          ignoreCancelToken === undefined
            ? this.config.options?.ignoreCancelToken
            : ignoreCancelToken;

        !ignoreCancel && axiosCanceler.cache(config);
        if (doRequestHandler && isFunction(doRequestHandler)) {
          config = doRequestHandler(Object.assign(this.config, config));
        }
        return config;
      },
      undefined,
    );

    doRequestErrorHandler &&
      isFunction(doRequestErrorHandler) &&
      this.instance.interceptors.request.use(undefined, doRequestErrorHandler);

    this.instance.interceptors.response.use((response: AxiosResponse<any>) => {
      response && axiosCanceler.remove(response.config);
      if (doResponseHandler && isFunction(doResponseHandler)) {
        response = doResponseHandler(this.config, response);
      }
      return response;
    }, undefined);

    afterResponseErrorHandler &&
      isFunction(afterResponseErrorHandler) &&
      this.instance.interceptors.response.use(undefined, (error) => {
        return afterResponseErrorHandler(this, this.instance, error);
      });
  }
}

export default AxiosObject;

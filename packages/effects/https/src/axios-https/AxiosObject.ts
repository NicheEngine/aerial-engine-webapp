import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import type {
  AxiosHttpDataRecord,
  AxiosHttpMultifile,
  AxiosHttpRequestConfig,
  AxiosHttpRequestOptions,
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

  delete<T = any>(options: AxiosHttpRequestOptions): Promise<T> {
    return this.request({ ...options, method: 'DELETE' });
  }

  download<T = any>(options: AxiosHttpRequestOptions): Promise<T> {
    const axiosOptions = Object.assign(
      {
        resultType: 'body',
        responseType: 'blob',
      } as AxiosHttpRequestOptions,
      options,
    );
    return this.request({ ...axiosOptions, method: 'GET' });
  }

  get<T = any>(options: AxiosHttpRequestOptions): Promise<T> {
    return this.request({ ...options, method: 'GET' });
  }

  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  post<T = any>(options: AxiosHttpRequestOptions): Promise<T> {
    return this.request({ ...options, method: 'POST' });
  }

  put<T = any>(options: AxiosHttpRequestOptions): Promise<T> {
    return this.request({ ...options, method: 'PUT' });
  }

  request<T>(options: AxiosHttpRequestOptions): Promise<T> {
    let axiosOptions: AxiosHttpRequestOptions = cloneDeep(options);
    const configHandler = this.config.handler;

    axiosOptions = {
      ...axiosOptions,
      ...(axiosOptions.paramsSerializer
        ? { paramsSerializer: serializeParams(axiosOptions.paramsSerializer) }
        : { paramsSerializer: serializeParams(this.config.paramsSerializer) }),
    };

    const {
      afterRequestErrorHandler,
      afterResponseErrorHandler,
      beforeRequestHandler,
      beforeResponseHandler,
    } = configHandler || {};

    if (beforeRequestHandler && isFunction(beforeRequestHandler)) {
      axiosOptions = beforeRequestHandler(this.config, axiosOptions);
    }

    axiosOptions = this.supportFormData(axiosOptions);

    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<AxiosHttpResult>>(axiosOptions)
        .then((response: AxiosResponse<AxiosHttpResult>) => {
          if (beforeResponseHandler && isFunction(beforeResponseHandler)) {
            try {
              const result = beforeResponseHandler(
                this.config,
                axiosOptions,
                response,
              );
              resolve(result);
            } catch (error: any) {
              if (
                afterResponseErrorHandler &&
                isFunction(afterResponseErrorHandler)
              ) {
                afterResponseErrorHandler(this, this.instance, error)
                  .then((result: any) => {
                    resolve(result);
                  })
                  .catch(() => {});
              }
            }
          }
          resolve(response.data as unknown as T);
        })
        .catch((error: any) => {
          if (
            afterRequestErrorHandler &&
            isFunction(afterRequestErrorHandler)
          ) {
            afterRequestErrorHandler(this, error).catch(() => {});
            resolve(error);
          } else {
            reject(error);
          }
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
  supportFormData(options: AxiosHttpRequestOptions) {
    const headers = (options?.headers || this.config?.headers) as any;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];
    if (
      contentType !== 'application/x-www-form-urlencoded;charset=utf-8' ||
      !Reflect.has(options, 'data') ||
      options.method?.toUpperCase() === 'GET'
    ) {
      return options;
    }

    return {
      ...options,
      data: qs.stringify(options.data, { arrayFormat: 'brackets' }),
    };
  }

  upload<T = any>(config: AxiosHttpRequestOptions, params: AxiosHttpMultifile) {
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
      (options: InternalAxiosRequestConfig<any>) => {
        const axiosConfig = options as AxiosHttpRequestConfig;
        const ignoreCancelToken = axiosConfig.options?.ignoreCancelToken;
        const ignoreCancel =
          ignoreCancelToken === undefined
            ? this.config.options?.ignoreCancelToken
            : ignoreCancelToken;

        !ignoreCancel && axiosCanceler.cache(options);
        if (doRequestHandler && isFunction(doRequestHandler)) {
          options = doRequestHandler(this.config, options);
        }
        return options;
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

import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import type {
  AxiosHttpRequestConfig,
  AxiosHttpRequestOptions,
  AxiosHttpResult,
} from './types';

import AxiosObject from './AxiosObject';

abstract class AxiosHandler {
  afterRequestErrorHandler?: (
    axiosObject: AxiosObject,
    error: any,
  ) => Promise<any>;

  afterResponseErrorHandler?: (
    axiosObject: AxiosObject,
    instance: AxiosInstance,
    error: any,
  ) => Promise<any>;

  beforeRequestHandler?: (
    config: AxiosHttpRequestConfig,
    options: AxiosHttpRequestOptions,
  ) => AxiosHttpRequestOptions;

  beforeResponseHandler?: (
    config: AxiosHttpRequestConfig,
    options: AxiosHttpRequestOptions,
    response: AxiosResponse<AxiosHttpResult>,
  ) => any;

  doRequestErrorHandler?: (error: Error) => void;

  doRequestHandler?: (
    config: AxiosHttpRequestConfig,
    options: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig;

  doResponseHandler?: (
    config: AxiosHttpRequestConfig<any>,
    response: AxiosResponse<any>,
  ) => AxiosResponse<any>;
}

export { AxiosHandler };

export default AxiosHandler;

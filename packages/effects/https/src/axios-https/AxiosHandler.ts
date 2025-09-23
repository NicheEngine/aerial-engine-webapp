import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import type { AxiosHttpRequestConfig, AxiosHttpResult } from './types';

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
  ) => AxiosHttpRequestConfig;

  beforeResponseHandler?: (
    config: AxiosHttpRequestConfig,
    response: AxiosResponse<AxiosHttpResult>,
  ) => any;

  doRequestErrorHandler?: (error: Error) => void;

  doRequestHandler?: (
    config: AxiosHttpRequestConfig,
  ) => InternalAxiosRequestConfig;

  doResponseHandler?: (
    config: AxiosHttpRequestConfig<any>,
    response: AxiosResponse<any>,
  ) => AxiosResponse<any>;
}

export { AxiosHandler };

export default AxiosHandler;

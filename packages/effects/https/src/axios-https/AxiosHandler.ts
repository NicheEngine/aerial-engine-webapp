import type { AxiosInstance, AxiosResponse } from 'axios';

import type { AxiosHttpRequestConfig, AxiosHttpResult } from './types';

import AxiosObject from './AxiosObject';

abstract class AxiosHandler {
  afterRequestErrorHandler?: (
    error: Error,
    config: AxiosHttpRequestConfig,
  ) => Promise<any>;

  afterResponseErrorHandler?: (
    axiosObject: AxiosObject,
    instance: AxiosInstance,
    error: Error,
  ) => void;

  beforeRequestHandler?: (
    config: AxiosHttpRequestConfig,
  ) => AxiosHttpRequestConfig;

  beforeResponseHandler?: (
    config: AxiosHttpRequestConfig,
    response: AxiosResponse<AxiosHttpResult>,
  ) => any;

  doRequestErrorHandler?: (error: Error) => void;

  doRequestHandler?: (
    config: AxiosHttpRequestConfig<any>,
  ) => AxiosHttpRequestConfig;

  doResponseHandler?: (
    config: AxiosHttpRequestConfig<any>,
    response: AxiosResponse<any>,
  ) => AxiosResponse<any>;
}

export { AxiosHandler };

export default AxiosHandler;

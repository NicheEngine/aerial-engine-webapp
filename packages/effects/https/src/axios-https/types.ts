import type { InternalAxiosRequestConfig } from 'axios';

import AxiosHandler from './AxiosHandler';

type AxiosSerializeOptions<T = any> = {
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | InternalAxiosRequestConfig<T>['paramsSerializer'];
};

type AxiosHttpRetryOptions = {
  count: number;
  isRetry: boolean;
  waitTime: number;
};

type AxiosHttpConfigOptions = {
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string;
  // Format request parameter time
  formatDate?: boolean;
  // 请求重试机制
  ignoreCancelToken?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isNativeResponse?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // Whether to add a timestamp
  joinTime?: boolean;
  tokenPrefix?: string;
  // 请求拼接路径
  urlPrefix?: string;
  // Whether to send token in header
  withToken?: boolean;
};

type AxiosResultOptions = {
  dataField: ((response: any) => any) | string;
  messageHandler?: (message: string, error: any) => void;
  resultType: 'body' | 'data' | 'raw';
  statusField: string;
  successStatus: ((status: any) => boolean) | number | string;
};

type AxiosAuthTokenOptions = {
  accessToken: () => string;
  authenticate: () => Promise<void>;
  formatToken: (token: string) => null | string;
  isRefreshToken: boolean;
  refreshToken: () => Promise<string>;
  tokenPrefix: string;
  unauthorizedStatus: number[];
};

interface AxiosHttpRequestConfig<T = any>
  extends InternalAxiosRequestConfig<T> {
  handler?: AxiosHandler;
  options?: AxiosHttpConfigOptions;
  serialize?: AxiosSerializeOptions;
  result?: AxiosResultOptions;
  authToken: AxiosAuthTokenOptions;
  httpRetry?: AxiosHttpRetryOptions;
}

type AxiosHttpDataRecord<T = any> = Record<string, T>;

type AxiosHttpMultifile = {
  [key: string]: any;
  // Other parameters
  data?: AxiosHttpDataRecord;
  // file name
  file: Blob | File;
  // file name
  filename?: string;
  // File parameter interface field name
  name?: string;
};

type AxiosHttpResult<T = any> = {
  code?: number;
  data: T;
  message: string;
  status?: number;
};

export type {
  AxiosAuthTokenOptions,
  AxiosHttpConfigOptions,
  AxiosHttpDataRecord,
  AxiosHttpMultifile,
  AxiosHttpRequestConfig,
  AxiosHttpResult,
  AxiosHttpRetryOptions,
  AxiosResultOptions,
  AxiosSerializeOptions,
};

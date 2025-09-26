import type { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';

import AxiosHandler from './AxiosHandler';

type AxiosSerializeOptions<T = any> = {
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];
};

type AxiosHttpRetryOptions = {
  count: number;
  isRetry: boolean;
  waitTime: number;
};

type AxiosHttpConfigOptions = {
  apiUrl?: string;
  formatDate?: boolean;
  ignoreCancelToken?: boolean;
  isNativeResponse?: boolean;
  isTransformResponse?: boolean;
  joinParamsToUrl?: boolean;
  joinPrefix?: boolean;
  joinTime?: boolean;
  tokenPrefix?: string;
  urlPrefix?: string;
  withToken?: boolean;
};

type AxiosResultOptions = {
  dataField: ((response: any) => any) | string;
  errorLog: boolean;
  messageHandler?: (message: string, error: any) => void;
  statusField: string;
  successStatus: ((status: any) => boolean) | number | string;
};

type AxiosAuthTokenOptions = {
  accessToken: () => string;
  authenticate: () => Promise<void>;
  isRefreshToken: boolean;
  refreshToken: () => Promise<string>;
  tokenPrefix: string;
  unauthorizedStatus: number[];
};

interface AxiosHttpRequestOptions<T = any> extends AxiosRequestConfig<T> {
  resultType?: 'body' | 'raw';
}

interface AxiosHttpRequestConfig<D = any> extends CreateAxiosDefaults<D> {
  handler?: AxiosHandler;
  options?: AxiosHttpConfigOptions;
  serialize?: AxiosSerializeOptions;
  result: AxiosResultOptions;
  authToken?: AxiosAuthTokenOptions;
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
  AxiosHttpRequestOptions,
  AxiosHttpResult,
  AxiosHttpRetryOptions,
  AxiosResultOptions,
  AxiosSerializeOptions,
};

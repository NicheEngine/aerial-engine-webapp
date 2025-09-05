import type { AxiosInstance } from 'axios';

import type { AxiosHttpRequestConfig } from './types';

export class AxiosRetry {
  async retry(
    AxiosInstance: AxiosInstance,
    axiosConfig: AxiosHttpRequestConfig,
    error: any,
  ) {
    const { config } = error;

    const httpRetry = axiosConfig?.httpRetry;
    const waitTime = httpRetry?.count || 0;
    const count = httpRetry?.count || 0;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    return this.delay(waitTime).then(() => AxiosInstance(config));
  }

  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}

export default AxiosRetry;

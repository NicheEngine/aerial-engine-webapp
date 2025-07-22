import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'
import { isFunction } from '@uts/staple.ts'

export class AxiosCanceler {
  private static instance: AxiosCanceler
  private static PENDING_CACHE = new Map<string, Canceler>()

  private constructor() {
    AxiosCanceler.PENDING_CACHE = new Map<string, Canceler>()
  }

  static default(): AxiosCanceler {
    if (AxiosCanceler.instance) {
      return AxiosCanceler.instance
    } else {
      AxiosCanceler.instance = new AxiosCanceler()
      return AxiosCanceler.instance
    }
  }

  private static joinUrl(config: AxiosRequestConfig): string {
    return [config.method, config.url].join('&')
  }

  static cache(config: AxiosRequestConfig) {
    this.remove(config)
    const url = AxiosCanceler.joinUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!AxiosCanceler.PENDING_CACHE.has(url)) {
          // If there is no current request in pending, add it
          AxiosCanceler.PENDING_CACHE.set(url, cancel)
        }
      })
  }

  static remove(config: AxiosRequestConfig) {
    const url = AxiosCanceler.joinUrl(config)

    if (AxiosCanceler.PENDING_CACHE.has(url)) {
      /**
       * If there is a current request identifier in pending,
       * the current request needs to be cancelled and removed
       */
      const cancel = AxiosCanceler.PENDING_CACHE.get(url)
      cancel && cancel(url)
      AxiosCanceler.PENDING_CACHE.delete(url)
    }
  }

  static removeAll() {
    AxiosCanceler.PENDING_CACHE.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    AxiosCanceler.PENDING_CACHE.clear()
  }

  static reset(): void {
    AxiosCanceler.PENDING_CACHE = new Map<string, Canceler>()
  }

  cache(config: AxiosRequestConfig) {
    this.remove(config)
    const url = AxiosCanceler.joinUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!AxiosCanceler.PENDING_CACHE.has(url)) {
          // If there is no current request in pending, add it
          AxiosCanceler.PENDING_CACHE.set(url, cancel)
        }
      })
  }

  remove(config: AxiosRequestConfig) {
    const url = AxiosCanceler.joinUrl(config)

    if (AxiosCanceler.PENDING_CACHE.has(url)) {
      /**
       * If there is a current request identifier in pending,
       * the current request needs to be cancelled and removed
       */
      const cancel = AxiosCanceler.PENDING_CACHE.get(url)
      cancel && cancel(url)
      AxiosCanceler.PENDING_CACHE.delete(url)
    }
  }

  removeAll() {
    AxiosCanceler.PENDING_CACHE.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    AxiosCanceler.PENDING_CACHE.clear()
  }

  reset(): void {
    AxiosCanceler.PENDING_CACHE = new Map<string, Canceler>()
  }
}

export default AxiosCanceler

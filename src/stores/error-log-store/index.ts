import { reactive } from 'vue'
import { defineStore, type Store, type StoreDefinition } from 'pinia'
import store from '@srs/index'
import type { ErrorLogContext, ErrorLogStore } from 'error-log-store'
import type { ErrorLogInfo } from '@mds/info/errorLogInfo.ts'
import { formatTime } from '@uts/date.ts'
import { PROJECT_SETTING } from 'app-settings'
import { ErrorType } from '@ems/exceptionTypes.ts'

const storeId: string = 'error-log'

const storeOptions = (): ErrorLogStore => {
  const context: ErrorLogContext = reactive({
    errorLogInfos: null,
    errorLogSize: 0,
  })

  function getErrorLogInfos(): ErrorLogInfo[] {
    return context.errorLogInfos || []
  }

  function getErrorLogSize(): number {
    return context.errorLogSize
  }

  function setErrorLogSize(size: number): void {
    context.errorLogSize = size
  }

  function addErrorLogInfo(errorLogInfo: ErrorLogInfo): void {
    const item = {
      ...errorLogInfo,
      time: formatTime(new Date()),
    }
    context.errorLogInfos = [item, ...(context.errorLogInfos || [])]
    context.errorLogSize += 1
  }

  /* Triggered after ajax request error */
  function addAjaxErrorInfo(error: any): void {
    const { useErrorHandle } = PROJECT_SETTING
    if (!useErrorHandle) {
      return
    }
    const errorInfo: Partial<ErrorLogInfo> = {
      message: error.message,
      type: ErrorType.AJAX,
    }
    if (error?.response) {
      const {
        config: { url = '', data: params = '', method = 'GET', headers = {} } = {},
        data = {},
      } = error.response
      errorInfo.url = url
      errorInfo.name = 'Ajax Error!'
      errorInfo.file = '-'
      errorInfo.stack = JSON.stringify(data)
      errorInfo.detail = JSON.stringify({ params, method, headers })
    }
    addErrorLogInfo(errorInfo as ErrorLogInfo)
  }

  return {
    /* 持久化 */
    persist: false,
    getErrorLogInfos,
    getErrorLogSize,
    setErrorLogSize,
    addErrorLogInfo,
    addAjaxErrorInfo,
  } as ErrorLogStore
}

const errorLogStore: StoreDefinition<
  string,
  Pick<ErrorLogStore, never>,
  Pick<ErrorLogStore, never>,
  Pick<ErrorLogStore, keyof ErrorLogStore>
> = defineStore(storeId, storeOptions)

export function useErrorLogStore(): Store<
  string,
  Pick<ErrorLogStore, never>,
  Pick<ErrorLogStore, never>,
  Pick<ErrorLogStore, keyof ErrorLogStore>
> {
  return errorLogStore(store)
}

export default errorLogStore

declare module 'error-log-store' {
  import type { DefineStoreOptionsBase } from 'pinia'
  import type { ErrorLogInfo } from '@mds/info/errorLogInfo.ts'

  export interface ErrorLogContext {
    errorLogInfos: Nullable<ErrorLogInfo[]>
    errorLogSize: number
  }

  export interface ErrorLogStore extends DefineStoreOptionsBase {
    getErrorLogInfos: () => ErrorLogInfo[]
    getErrorLogSize: () => number
    setErrorLogSize: (size: number) => void
    addErrorLogInfo: (errorLogInfo: ErrorLogInfo) => void
    addAjaxErrorInfo: (error: any) => void
  }

  export { errorLogStore, useErrorLogStore } from './index.ts'
}

declare module 'context-hook' {
  import { UnwrapRef } from 'vue'
  export interface ContextOptions {
    readonly?: boolean
    provider?: boolean
    native?: boolean
  }

  export type ShallowUnwrap<T> = {
    [P in keyof T]: UnwrapRef<T[P]>
  }

  export { createContext, useContextHook } from './index.ts'
}

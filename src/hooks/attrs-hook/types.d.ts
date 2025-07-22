declare module 'attrs-hook' {
  export interface AttrsOptions {
    excludeListeners?: boolean
    excludeKeys?: string[]
    excludeDefaultKeys?: boolean
  }
  export { useAttrsHook } from './index.ts'
}

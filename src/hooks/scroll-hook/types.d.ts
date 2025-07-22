declare module 'scroll-hook' {
  export interface ScrollToParams {
    el: any
    to: number
    duration?: number
    callback?: () => any
  }

  export { useScrollHook } from './scroll.ts'

  export { useScrollToHook } from './scrollTo.ts'
}

declare module 'window-size-hook' {
  export interface WindowSizeOptions {
    once?: boolean
    immediate?: boolean
    listenerOptions?: AddEventListenerOptions | boolean
  }
  export { useWindowSizeHook } from './index.ts'
}

declare module 'dom-util' {
  export interface ViewportOffset {
    left: number
    top: number
    right: number
    bottom: number
    rightIncludeBody: number
    bottomIncludeBody: number
  }

  export {
    clientRect,
    hasClass,
    addClass,
    removeClass,
    viewportOffset,
    hackCss,
    on,
    off,
    once,
    useRafThrottle,
  } from './index.ts'
}

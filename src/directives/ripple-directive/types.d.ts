declare module 'ripple-directive' {
  export interface RippleOptions {
    event: keyof HTMLElementEventMap
    transition: number
  }

  export interface RippleProto {
    background?: string
    zIndex?: string
  }

  export type RippleEventType = Event & MouseEvent & TouchEvent

  export { RIPPLE_DIRECTIVE } from 'index.ts'
}

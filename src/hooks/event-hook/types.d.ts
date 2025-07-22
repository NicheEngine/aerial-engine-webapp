declare module 'event-hook' {
  import type { Ref } from 'vue'

  export type EventRemove = () => void
  export interface EventParams {
    el?: Element | Ref<Element | undefined> | Window | any
    name: string
    listener: EventListener
    options?: boolean | AddEventListenerOptions
    autoRemove?: boolean
    isDebounce?: boolean
    wait?: number
  }

  export { useEventListenerHook } from './index.ts'
}

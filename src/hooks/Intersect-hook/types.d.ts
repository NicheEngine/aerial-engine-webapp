declare module 'intersect-hook' {
  import { Ref } from 'vue'
  export interface IntersectObserverProps {
    target: Ref<Element | null | undefined>
    root?: Ref<any>
    onIntersect: IntersectionObserverCallback
    rootMargin?: string
    threshold?: number
  }

  export { useIntersectHook } from './index.ts'
}

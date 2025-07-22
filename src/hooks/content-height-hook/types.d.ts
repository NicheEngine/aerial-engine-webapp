declare module 'content-height-hook' {
  import type { Ref } from 'vue'
  export interface CompensateHeight {
    // 使用 layout Footer 高度作为判断补偿高度的条件
    layoutFooter: boolean
    // refs HTMLElement
    elements?: Ref[]
  }

  export type Upward = number | string | null | undefined

  export { useContentHeightHook } from './index.ts'
}

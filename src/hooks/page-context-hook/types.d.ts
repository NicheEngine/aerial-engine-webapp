declare module 'page-context-hook' {
  import type { ComputedRef, Ref } from 'vue'

  export interface PageContextProps {
    contentHeight: ComputedRef<number>
    pageHeight: Ref<number>
    setPageHeight: (height: number) => Promise<void>
  }

  export { createPageContext, usePageContextHook } from './index.ts'
}

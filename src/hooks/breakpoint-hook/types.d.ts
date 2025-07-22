declare module 'breakpoint-hook' {
  import { ComputedRef } from 'vue'
  import { SizeType, ScreenType } from '@ems/breakpointTypes.ts'
  export interface BreakpointOptions {
    screen: ComputedRef<SizeType | undefined>
    width: ComputedRef<number>
    realWidth: ComputedRef<number>
    screenType: ScreenType
    screenFitter: Map<SizeType, number>
    sizeType: SizeType
  }
  export { useBreakpointHook, createBreakpointListener } from './index.ts'
}

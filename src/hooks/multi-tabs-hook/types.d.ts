declare module 'multi-tabs-hook' {
  export enum MultiTabsAction {
    REFRESH,
    CLOSE_ALL,
    CLOSE_LEFT,
    CLOSE_RIGHT,
    CLOSE_OTHER,
    CLOSE_CURRENT,
    CLOSE,
  }

  export { useMultiTabsHook } from './index.ts'
}

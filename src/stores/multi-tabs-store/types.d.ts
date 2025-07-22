declare module 'multi-tabs-store' {
  import type { RouteLocationNormalized, Router } from 'vue-router'
  import type { DefineStoreOptionsBase } from 'pinia'

  export interface MultiTabsContext {
    cacheTabs: Set<string>
    multiTabs: RouteLocationNormalized[]
    lastDragEndIndex: number
  }

  export interface MultiTabsStore extends DefineStoreOptionsBase {
    getMultiTabs: () => RouteLocationNormalized[]
    getCacheTabs: () => string[]
    getLastDragEndIndex: () => number
    updateCacheTabs: () => Promise<void>
    clearCacheTabs: () => void
    resetContext: () => void
    refreshRouter: (router: Router) => Promise<void>
    gotoRouter: (router: Router) => Promise<void>
    addMultiTabs: (route: RouteLocationNormalized) => Promise<void>
    closeMultiTabs: (multiTab: RouteLocationNormalized, router: Router) => Promise<void>
    closeMultiTabsByKey: (key: string, router: Router) => Promise<void>
    sortMultiTabs: (oldIndex: number, newIndex: number) => Promise<void>
    closeLeftMultiTabs: (multiTab: RouteLocationNormalized, router: Router) => Promise<void>
    closeRightMultiTabs: (multiTab: RouteLocationNormalized, router: Router) => Promise<void>
    closeAllMultiTabs: (router: Router) => Promise<void>
    closeOtherMultiTabs: (multiTab: RouteLocationNormalized, router: Router) => Promise<void>
    setMultiTabTitle: (title: string, multiTab: RouteLocationNormalized) => Promise<void>
    setMultiTabPath: (fullPath: string, multiTab: RouteLocationNormalized) => Promise<void>
  }

  export { multiTabsStore, useMultiTabsStore } from './index.ts'
}

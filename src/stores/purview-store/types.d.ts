declare module 'purview-store' {
  import type { RouteRaw } from '@rts/types'
  import type { MenuInfo } from '@rts/types'
  import type { DefineStoreOptionsBase } from 'pinia'
  export interface PurviewContext {
    /**
     * purview code list
     * 权限代码列表
     */
    purviewCodes: string[] | number[]
    /**
     * whether the route has been dynamically added
     * 路由是否动态添加
     */
    isDynamicAddedRoute: boolean
    /**
     * to trigger a menu update
     * 触发菜单更新
     */
    lastBuildMenuTime: number
    backMenuInfos: MenuInfo[]
    frontMenuInfos: MenuInfo[]
  }

  export interface PurviewStore extends DefineStoreOptionsBase {
    context: PurviewContext
    getPurviewCodes: () => string[] | number[]
    setPurviewCodes: (purviewCodes: string[]) => void
    getBackMenuInfos: () => MenuInfo[]
    setBackMenuInfos: (backMenuInfos: MenuInfo[]) => void
    getFrontMenuInfos: () => MenuInfo[]
    setFrontMenuInfos: (frontMenuInfos: MenuInfo[]) => void
    getLastBuildMenuTime: () => number
    setLastBuildMenuTime: () => void
    isDynamicAddedRoute: () => boolean
    setDynamicAddedRoute: (isDynamicAddedRoute: boolean) => void
    resetContext: () => void
    asyncRefreshCodes: () => Promise<void>
    asyncBuildRoutes: () => Promise<RouteRaw[]>
  }

  export { purviewStore, usePurviewStore } from './index.ts'
}

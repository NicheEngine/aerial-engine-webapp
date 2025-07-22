import { reactive, toRaw } from 'vue'
import { useAppStore } from 'app-store'
import { useUserStore } from 'user-store'
import { PROJECT_SETTING } from 'app-settings'
import type { PurviewContext, PurviewStore } from 'purview-store'
import type { MenuInfo, RouteRaw } from 'app-routers'
import { PurviewType } from '@ems/appTypes'
import { PageType } from '@ems/pageTypes'

import { transformRouteToMenu, transformObjectToRoute, flatMultiLevelRoutes } from 'app-routers'
import { ERROR_LOG_ROUTE, NOT_FOUND_ROUTE, ASYNC_ROUTES } from 'system-routers'
import { filterOfTree } from 'tree-util'

import { getMenuList } from '/@/api/sys/menu'
import { getPermCode } from '/@/api/sys/user'
import { useI18nHook } from 'i18n-hook'
import { useMessageHook } from 'message-hook'
import type { Store, StoreDefinition } from 'pinia'
import { defineStore } from 'pinia'
import store from '@/stores'
import type { RoleType } from '@ems/roleTypes.ts'

const storeId: string = 'purview'

const storeOptions = (): PurviewStore => {
  const context: PurviewContext = reactive({
    purviewCodes: [],
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    backMenuInfos: [],
    frontMenuInfos: [],
  })

  function getPurviewCodes(): string[] | number[] {
    return context.purviewCodes
  }

  function setPurviewCodes(purviewCodes: string[]): void {
    context.purviewCodes = purviewCodes
  }

  function getBackMenuInfos(): MenuInfo[] {
    return context.backMenuInfos
  }

  function setBackMenuInfos(backMenuInfos: MenuInfo[]): void {
    context.backMenuInfos = backMenuInfos
    backMenuInfos?.length > 0 && setLastBuildMenuTime()
  }

  function getFrontMenuInfos(): MenuInfo[] {
    return context.frontMenuInfos
  }

  function setFrontMenuInfos(frontMenuInfos: MenuInfo[]): void {
    context.frontMenuInfos = frontMenuInfos
  }

  function getLastBuildMenuTime(): number {
    return context.lastBuildMenuTime
  }

  function setLastBuildMenuTime(): void {
    context.lastBuildMenuTime = new Date().getTime()
  }

  function isDynamicAddedRoute(): boolean {
    return context.isDynamicAddedRoute
  }

  function setDynamicAddedRoute(isDynamicAddedRoute: boolean): void {
    context.isDynamicAddedRoute = isDynamicAddedRoute
  }

  function resetContext(): void {
    context.isDynamicAddedRoute = false
    context.purviewCodes = []
    context.backMenuInfos = []
    context.lastBuildMenuTime = 0
  }

  async function asyncRefreshCodes(): Promise<void> {
    const purviewCodes = await getPermCode()
    setPurviewCodes(purviewCodes)
  }

  async function asyncBuildRoutes(): Promise<RouteRaw[]> {
    const { t } = useI18nHook()
    const userStore = useUserStore()
    const appStore = useAppStore()

    let routes: RouteRaw[] = []
    const roleTypes: RoleType[] = toRaw(userStore.getUserRoles()) || []
    const { purviewType = PROJECT_SETTING.purviewType } = appStore.getProjectSetting()

    /* 路由过滤器 在 函数filter 作为回调传入遍历使用 */
    const routeFilter = (route: RouteRaw) => {
      const { meta } = route
      /* 抽出角色 */
      const { roles } = meta || {}
      if (!roles) return true
      /* 进行角色权限判断 */
      return roleTypes.some((role) => roles.includes(role))
    }

    const routeRemoveIgnoreFilter = (route: RouteRaw) => {
      const { meta } = route
      /* ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现 */
      const { ignoreRoute } = meta || {}
      /* arr.filter 返回 true 表示该元素通过测试 */
      return !ignoreRoute
    }

    /**
     * 根据设置的首页path，修正routes中的affix标记（固定首页）
     */
    const patchHomeAffix = (routes: RouteRaw[]) => {
      if (!routes || routes.length === 0) return
      let homePath: string = userStore.getUserInfo().homePath || PageType.BASE_HOME

      function patcher(routes: RouteRaw[], parentPath: string = '') {
        if (parentPath) parentPath = parentPath + '/'
        routes.forEach((route: RouteRaw) => {
          const { path, children, redirect } = route
          const currentPath = path.startsWith('/') ? path : parentPath + path
          if (currentPath === homePath) {
            if (redirect) {
              homePath = route.redirect! as string
            } else {
              route.meta = Object.assign({}, route.meta, { affix: true })
              throw new Error('end')
            }
          }
          children && children.length > 0 && patcher(children, currentPath)
        })
      }
      try {
        patcher(routes)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ignored) {
        /* 已处理完毕跳出循环 */
      }
      return
    }

    switch (purviewType) {
      // 角色权限
      case PurviewType.ROLE:
        // 对非一级路由进行过滤
        routes = filterOfTree(ASYNC_ROUTES, routeFilter)
        // 对一级路由根据角色权限过滤
        routes = routes.filter(routeFilter)
        // Convert multi-level routing to level 2 routing
        // 将多级路由转换为 2 级路由
        routes = flatMultiLevelRoutes(routes)
        break

      // 路由映射， 默认进入该case
      case PurviewType.ROUTE:
        // 对非一级路由进行过滤
        routes = filterOfTree(ASYNC_ROUTES, routeFilter)
        // 对一级路由再次根据角色权限过滤
        routes = routes.filter(routeFilter)
        // 将路由转换成菜单
        const menuInfos: MenuInfo[] = transformRouteToMenu(routes, true)
        // 移除掉 ignoreRoute: true 的路由 非一级路由
        routes = filterOfTree(routes, routeRemoveIgnoreFilter)
        // 移除掉 ignoreRoute: true 的路由 一级路由；
        routes = routes.filter(routeRemoveIgnoreFilter)
        // 对菜单进行排序
        menuInfos.sort((source, target) => {
          return (source.meta?.order || 0) - (target.meta?.order || 0)
        })
        // 设置菜单列表
        setFrontMenuInfos(menuInfos)
        // Convert multi-level routing to level 2 routing
        // 将多级路由转换为 2 级路由
        routes = flatMultiLevelRoutes(routes)
        break

      //  If you are sure that you do not need to do background dynamic purview,
      //  please comment the entire judgment below
      //  如果确定不需要做后台动态权限，请在下方评论整个判断
      case PurviewType.SERVER:
        const { createMessage } = useMessageHook()
        createMessage.loading({
          content: t('sys.app.menuLoading'),
          duration: 1,
        })

        /**
         *  !Simulate to obtain purview codes from the background,
         *  模拟从后台获取权限码，
         *  this function may only need to be executed once, and the actual project can be put at the right time by itself
         *  这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
         */
        let routeList: RouteRaw[] = []
        try {
          await asyncRefreshCodes()
          routeList = (await getMenuList()) as RouteRaw[]
        } catch (error) {
          console.error(error)
        }

        /**
         * dynamically introduce components
         * 动态引入组件
         */
        routeList = transformObjectToRoute(routeList)

        //  Background routing to menu structure
        //  后台路由到菜单结构
        const backMenuInfos = transformRouteToMenu(routeList)
        setBackMenuInfos(backMenuInfos)

        // remove meta.ignoreRoute item
        // 删除 meta.ignoreRoute 项
        routeList = filterOfTree(routeList, routeRemoveIgnoreFilter)
        routeList = routeList.filter(routeRemoveIgnoreFilter)

        routeList = flatMultiLevelRoutes(routeList)
        routes = [NOT_FOUND_ROUTE, ...routeList]
        break
    }

    routes.push(ERROR_LOG_ROUTE)
    patchHomeAffix(routes)
    return routes
  }

  return {
    /* 持久化 */
    persist: true,
    context,
    getPurviewCodes,
    setPurviewCodes,
    getBackMenuInfos,
    setBackMenuInfos,
    getFrontMenuInfos,
    setFrontMenuInfos,
    getLastBuildMenuTime,
    setLastBuildMenuTime,
    isDynamicAddedRoute,
    setDynamicAddedRoute,
    resetContext,
    asyncRefreshCodes,
    asyncBuildRoutes,
  } as PurviewStore
}

const purviewStore: StoreDefinition<
  string,
  Pick<PurviewStore, never>,
  Pick<PurviewStore, never>,
  Pick<PurviewStore, keyof PurviewStore>
> = defineStore(storeId, storeOptions)

export function usePurviewStore(): Store<
  string,
  Pick<PurviewStore, never>,
  Pick<PurviewStore, never>,
  Pick<PurviewStore, keyof PurviewStore>
> {
  return purviewStore(store)
}

export default purviewStore

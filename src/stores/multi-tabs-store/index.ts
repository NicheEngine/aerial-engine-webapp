import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'
import { reactive, toRaw, unref } from 'vue'
import { defineStore, type Store, type StoreDefinition } from 'pinia'
import store from '@srs/index'

import { useGotoRouteHook, useRedoRouteHook } from 'page-hook'
import { Persistent } from 'persistent-extend'

import { PageType } from '@ems/pageTypes.ts'
import { NOT_FOUND_ROUTE, REDIRECT_ROUTE } from 'system-routers'
import { rawRoute } from '@uts/common.ts'
import { MULTI_TABS_KEY } from '@ems/cacheTypes.ts'

import { PROJECT_SETTING } from 'app-settings'
import { useUserStore } from 'user-store'
import type { MultiTabsContext, MultiTabsStore } from 'multi-tabs-store'

const CACHE_TAB = PROJECT_SETTING.multiTabsSetting.cache

function handleGotoPage(router: Router) {
  const go = useGotoRouteHook(router)
  go(unref(router.currentRoute).path, true)
}

function handleToTarget(target: RouteLocationNormalized) {
  const { params, path, query } = target
  return {
    params: params || {},
    path,
    query: query || {},
  }
}

const storeId: string = 'multi-tabs'

const storeOptions = (): MultiTabsStore => {
  const context: MultiTabsContext = reactive({
    // Tabs that need to be cached
    cacheTabs: new Set(),
    // multi tab list
    multiTabs: CACHE_TAB ? Persistent.getLocal(MULTI_TABS_KEY) || [] : [],
    // Index of the last moved tab
    lastDragEndIndex: 0,
  })

  function getMultiTabs(): RouteLocationNormalized[] {
    return context.multiTabs
  }

  function getCacheTabs(): string[] {
    return Array.from(context.cacheTabs)
  }

  function getLastDragEndIndex(): number {
    return context.lastDragEndIndex
  }

  /* Update the cache according to the currently opened tabs */
  async function updateCacheTabs(): Promise<void> {
    const cacheSet: Set<string> = new Set()
    for (const tab of context.multiTabs) {
      const route = rawRoute(tab)
      // Ignore the cache
      const needCache = !route.meta?.ignoreKeepAlive
      if (!needCache) {
        continue
      }
      const name = route.name as string
      cacheSet.add(name)
    }
    context.cacheTabs = cacheSet
  }

  function clearCacheTabs(): void {
    context.cacheTabs = new Set()
  }

  function resetContext(): void {
    context.multiTabs = []
    clearCacheTabs()
  }

  /* refresh routers tabs */
  async function refreshRouter(router: Router): Promise<void> {
    const { currentRoute } = router
    const route = unref(currentRoute)
    const name = route.name
    const findTab = getCacheTabs().find((tab) => tab === name)
    if (findTab) {
      context.cacheTabs.delete(findTab)
    }
    const redo = useRedoRouteHook(router)
    await redo()
  }

  async function gotoRouter(router: Router): Promise<void> {
    const goto = useGotoRouteHook(router)
    const length = context.multiTabs.length
    const { path } = unref(router.currentRoute)
    let toPath: PageType | string = PageType.BASE_HOME
    if (length > 0) {
      const page = context.multiTabs[length - 1]
      const targetPath = page.fullPath || page.path
      if (targetPath) {
        toPath = targetPath
      }
    }
    // Jump to the current page and report an error
    path !== toPath && (await goto(toPath as PageType, true))
  }

  async function addMultiTabs(route: RouteLocationNormalized): Promise<void> {
    const { path, name, fullPath, params, query, meta } = rawRoute(route)
    // 404  The page does not need to add a tab
    if (
      path === PageType.ERROR_PAGE ||
      path === PageType.BASE_LOGIN ||
      !name ||
      [REDIRECT_ROUTE.name, NOT_FOUND_ROUTE.name].includes(name as string)
    ) {
      return
    }

    let updateIndex = -1
    // Existing pages, do not add tabs repeatedly
    const tabHasExits = context.multiTabs.some((tab, index) => {
      updateIndex = index
      return (tab.fullPath || tab.path) === (fullPath || path)
    })

    // If the tab already exists, perform the update operation
    if (tabHasExits) {
      const currentMultiTab = toRaw(context.multiTabs)[updateIndex]
      if (!currentMultiTab) {
        return
      }
      currentMultiTab.params = params || currentMultiTab.params
      currentMultiTab.query = query || currentMultiTab.query
      currentMultiTab.fullPath = fullPath || currentMultiTab.fullPath
      context.multiTabs.splice(updateIndex, 1, currentMultiTab)
    } else {
      // 获取动态路由打开数，超过 0 即代表需要控制打开数
      const dynamicLevel: number = meta?.dynamicLevel ? (meta?.dynamicLevel as number) : -1
      if (dynamicLevel > 0) {
        // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
        // 首先获取到真实的路由，使用配置方式减少计算开销.
        // const realName: string = path.match(/(\S*)\//)![1];
        const realPath = meta?.realPath ?? ''
        // 获取到已经打开的动态路由数, 判断是否大于某一个值
        if (
          context.multiTabs.filter((route) => route.meta?.realPath ?? '' === realPath).length >=
          dynamicLevel
        ) {
          // 关闭第一个
          const index = context.multiTabs.findIndex(
            (multiTab) => multiTab.meta.realPath === realPath,
          )
          index !== -1 && context.multiTabs.splice(index, 1)
        }
      }
      context.multiTabs.push(route)
    }
    await updateCacheTabs()
    CACHE_TAB && Persistent.setLocal(MULTI_TABS_KEY, context.multiTabs)
  }

  async function closeMultiTabs(multiTab: RouteLocationNormalized, router: Router): Promise<void> {
    const close = (route: RouteLocationNormalized) => {
      const { fullPath, meta: { affix } = {} } = route
      if (affix) {
        return
      }
      const index = context.multiTabs.findIndex((route) => route.fullPath === fullPath)
      index !== -1 && context.multiTabs.splice(index, 1)
    }
    const { currentRoute, replace } = router

    const { path } = unref(currentRoute)
    if (path !== multiTab.path) {
      // Closed is not the activation tab
      close(multiTab)
      return
    }
    // Closed is activated atb
    let toTarget: RouteLocationRaw = {}

    const index = context.multiTabs.findIndex((route) => route.path === path)
    // If the current is the leftmost tab
    if (index === 0) {
      // There is only one tab, then jump to the homepage, otherwise jump to the right tab
      if (context.multiTabs.length === 1) {
        const userStore = useUserStore()
        toTarget = userStore.getUserInfo.homePath || PageType.BASE_HOME
      } else {
        //  Jump to the right tab
        const page = context.multiTabs[index + 1]
        toTarget = handleToTarget(page)
      }
    } else {
      // Close the current tab
      const page = context.multiTabs[index - 1]
      toTarget = handleToTarget(page)
    }
    close(currentRoute.value)
    await replace(toTarget)
  }

  /* Close according to key */
  async function closeMultiTabsByKey(key: string, router: Router): Promise<void> {
    const index = context.multiTabs.findIndex((route) => (route.fullPath || route.path) === key)
    if (index !== -1) {
      await closeMultiTabs(context.multiTabs[index], router)
      const { currentRoute, replace } = router
      // 检查当前路由是否存在于multiTabs中
      const isActivated = context.multiTabs.findIndex((route) => {
        return route.fullPath === currentRoute.value.fullPath
      })
      // 如果当前路由不存在于TabList中，尝试切换到其它路由
      if (isActivated === -1) {
        let pageIndex
        if (index > 0) {
          pageIndex = index - 1
        } else if (index < context.multiTabs.length - 1) {
          pageIndex = index + 1
        } else {
          pageIndex = -1
        }
        if (pageIndex >= 0) {
          const page = context.multiTabs[index - 1]
          const toTarget = handleToTarget(page)
          await replace(toTarget)
        }
      }
    }
  }

  /* Sort the tabs */
  async function sortMultiTabs(oldIndex: number, newIndex: number): Promise<void> {
    const currentTab = context.multiTabs[oldIndex]
    context.multiTabs.splice(oldIndex, 1)
    context.multiTabs.splice(newIndex, 0, currentTab)
    context.lastDragEndIndex = context.lastDragEndIndex + 1
  }

  /* Close tabs in bulk */
  async function bulkCloseTabs(paths: string[]) {
    context.multiTabs = context.multiTabs.filter((route) => !paths.includes(route.fullPath))
  }

  /*  Close the tab on the right and jump */
  async function closeLeftMultiTabs(
    multiTab: RouteLocationNormalized,
    router: Router,
  ): Promise<void> {
    const index = context.multiTabs.findIndex((route) => route.path === multiTab.path)
    if (index > 0) {
      const leftTabs = context.multiTabs.slice(0, index)
      const paths: string[] = []
      for (const item of leftTabs) {
        const affix = item?.meta?.affix ?? false
        if (!affix) {
          paths.push(item.fullPath)
        }
      }
      await bulkCloseTabs(paths)
    }
    await updateCacheTabs()
    handleGotoPage(router)
  }

  /* Close the tab on the left and jump */
  async function closeRightMultiTabs(
    multiTab: RouteLocationNormalized,
    router: Router,
  ): Promise<void> {
    const index = context.multiTabs.findIndex((route) => route.fullPath === multiTab.fullPath)

    if (index >= 0 && index < context.multiTabs.length - 1) {
      const rightTabs = context.multiTabs.slice(index + 1, context.multiTabs.length)
      const paths: string[] = []
      for (const item of rightTabs) {
        const affix = item?.meta?.affix ?? false
        if (!affix) {
          paths.push(item.fullPath)
        }
      }
      await bulkCloseTabs(paths)
    }
    await updateCacheTabs()
    handleGotoPage(router)
  }

  async function closeAllMultiTabs(router: Router): Promise<void> {
    context.multiTabs = context.multiTabs.filter((item) => item?.meta?.affix ?? false)
    clearCacheTabs()
    await gotoRouter(router)
  }

  /* Close other tabs */
  async function closeOtherMultiTabs(
    multiTab: RouteLocationNormalized,
    router: Router,
  ): Promise<void> {
    const closePathList = context.multiTabs.map((route) => route.fullPath)

    const paths: string[] = []
    for (const path of closePathList) {
      if (path !== multiTab.fullPath) {
        const closeRoute = context.multiTabs.find((route) => route.path === path)
        if (!closeRoute) {
          continue
        }
        const affix = closeRoute?.meta?.affix ?? false
        if (!affix) {
          paths.push(closeRoute.fullPath)
        }
      }
    }
    await bulkCloseTabs(paths)
    await updateCacheTabs()
    handleGotoPage(router)
  }

  /* Set tab's title */
  async function setMultiTabTitle(title: string, multiTab: RouteLocationNormalized): Promise<void> {
    const findTab = context.multiTabs.find((route) => route === multiTab)
    if (findTab) {
      findTab.meta.title = title
      await updateCacheTabs()
    }
  }

  /* replace tabs path */
  async function setMultiTabPath(
    fullPath: string,
    multiTab: RouteLocationNormalized,
  ): Promise<void> {
    const findTab = context.multiTabs.find((route) => route === multiTab)
    if (findTab) {
      findTab.fullPath = fullPath
      findTab.path = fullPath
      await updateCacheTabs()
    }
  }

  return {
    /* 持久化 */
    persist: true,
    getMultiTabs,
    getCacheTabs,
    getLastDragEndIndex,
    updateCacheTabs,
    clearCacheTabs,
    resetContext,
    refreshRouter,
    gotoRouter,
    addMultiTabs,
    closeMultiTabs,
    closeMultiTabsByKey,
    sortMultiTabs,
    closeLeftMultiTabs,
    closeRightMultiTabs,
    closeAllMultiTabs,
    closeOtherMultiTabs,
    setMultiTabTitle,
    setMultiTabPath,
  } as MultiTabsStore
}

const multiTabsStore: StoreDefinition<
  string,
  Pick<MultiTabsStore, never>,
  Pick<MultiTabsStore, never>,
  Pick<MultiTabsStore, keyof MultiTabsStore>
> = defineStore(storeId, storeOptions)

export function useMultiTabsStore(): Store<
  string,
  Pick<MultiTabsStore, never>,
  Pick<MultiTabsStore, never>,
  Pick<MultiTabsStore, keyof MultiTabsStore>
> {
  return multiTabsStore(store)
}

export default multiTabsStore

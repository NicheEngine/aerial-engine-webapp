import type { RouteLocationNormalized, Router } from 'vue-router'
import { useRouter } from 'vue-router'
import { unref } from 'vue'
import { useMultiTabsStore } from 'multi-tabs-store'
import { useAppStore } from 'app-store'
import { MultiTabsAction } from 'multi-tabs-hook'

export function useMultiTabsHook(_router?: Router) {
  const appStore = useAppStore()

  function canIUseTabs(): boolean {
    const { show } = appStore.getMultiTabsSetting
    if (!show) {
      throw new Error('The multi-tab page is currently not open, please open it in the settings！')
    }
    return !!show
  }

  const multiTabsStore = useMultiTabsStore()
  const router = _router || useRouter()

  const { currentRoute } = router

  function getCurrentMultiTab() {
    const route = unref(currentRoute)
    return multiTabsStore
      .getMultiTabs()
      .find((item: RouteLocationNormalized) => item.fullPath === route.fullPath)!
  }

  async function updateMultiTabTitle(title: string, multiTab?: RouteLocationNormalized) {
    const canIUse = canIUseTabs
    if (!canIUse) {
      return
    }
    const targetTab = multiTab || getCurrentMultiTab()
    await multiTabsStore.setMultiTabTitle(title, targetTab)
  }

  async function updateMultiTabPath(path: string, multiTab?: RouteLocationNormalized) {
    const canIUse = canIUseTabs
    if (!canIUse) {
      return
    }
    const targetTab = multiTab || getCurrentMultiTab()
    await multiTabsStore.updateTabPath(path, targetTab)
  }

  async function handleMultiTabAction(action: MultiTabsAction, multiTab?: RouteLocationNormalized) {
    const canIUse = canIUseTabs
    if (!canIUse) {
      return
    }
    const currentMultiTab = getCurrentMultiTab()
    switch (action) {
      case MultiTabsAction.REFRESH:
        await multiTabsStore.refreshRouter(router)
        break

      case MultiTabsAction.CLOSE_ALL:
        await multiTabsStore.closeAllMultiTabs(router)
        break

      case MultiTabsAction.CLOSE_LEFT:
        await multiTabsStore.closeLeftMultiTabs(currentMultiTab, router)
        break

      case MultiTabsAction.CLOSE_RIGHT:
        await multiTabsStore.closeRightMultiTabs(currentMultiTab, router)
        break

      case MultiTabsAction.CLOSE_OTHER:
        await multiTabsStore.closeOtherMultiTabs(currentMultiTab, router)
        break

      case MultiTabsAction.CLOSE_CURRENT:
      case MultiTabsAction.CLOSE:
        await multiTabsStore.closeMultiTabs(multiTab || currentMultiTab, router)
        break
    }
  }

  return {
    refreshPage: () => handleMultiTabAction(MultiTabsAction.REFRESH),
    closeAll: () => handleMultiTabAction(MultiTabsAction.CLOSE_ALL),
    closeLeft: () => handleMultiTabAction(MultiTabsAction.CLOSE_LEFT),
    closeRight: () => handleMultiTabAction(MultiTabsAction.CLOSE_RIGHT),
    closeOther: () => handleMultiTabAction(MultiTabsAction.CLOSE_OTHER),
    closeCurrent: () => handleMultiTabAction(MultiTabsAction.CLOSE_CURRENT),
    close: (table?: RouteLocationNormalized) => handleMultiTabAction(MultiTabsAction.CLOSE, table),
    setTitle: (title: string, table?: RouteLocationNormalized) => updateMultiTabTitle(title, table),
    updatePath: (fullPath: string, table?: RouteLocationNormalized) =>
      updateMultiTabPath(fullPath, table),
  }
}

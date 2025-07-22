import type { Router, RouteLocationNormalized } from 'vue-router'
import { useAppStore } from 'app-store'
import { useUserStore } from 'user-store'
import { useTransitionSettingHook } from 'setting-hook'
import { AxiosCanceler } from 'app-https'
import { Modal, notification } from 'ant-design-vue'
import { warn } from '@uts/logger.ts'
import { unref } from 'vue'
import { setRouteChange } from 'app-logics'
import { createPurviewGuard, createStateGuard } from 'guard-router'
import NProgress from 'nprogress'
import { PROJECT_SETTING } from 'app-settings'
import { createParamMenuGuard } from './menu.ts'

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPageLoadingGuard(router)
  createHttpGuard(router)
  createScrollGuard(router)
  createMessageGuard(router)
  createProgressGuard(router)
  createPurviewGuard(router)
  createParamMenuGuard(router) // must after createPermissionGuard (menu has been built.)
  createStateGuard(router)
}

/**
 * Hooks for handling page state
 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>()

  router.beforeEach(async (to) => {
    // The page has already been loaded, it will be faster to open it again, you don’t need to do loading and other processing
    to.meta.loaded = !!loadedPageMap.get(to.path)
    // Notify routing changes
    setRouteChange(to)

    return true
  })

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true)
  })
}

// Used to handle page loading status
function createPageLoadingGuard(router: Router) {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const { computedOpenPageLoading } = useTransitionSettingHook()
  router.beforeEach(async (to) => {
    if (!userStore.getAccessToken()) {
      return true
    }
    if (to.meta.loaded) {
      return true
    }

    if (unref(computedOpenPageLoading)) {
      appStore.setPagesLoading(true)
      return true
    }

    return true
  })
  router.afterEach(async () => {
    if (unref(computedOpenPageLoading)) {
      // TODO Looking for a better way
      // The timer simulates the loading time to prevent flashing too fast,
      setTimeout(() => {
        appStore.setPagesLoading(false)
      }, 220)
    }
    return true
  })
}

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = PROJECT_SETTING
  let axiosCanceler: Nullable<AxiosCanceler>
  if (removeAllHttpPending) {
    axiosCanceler = AxiosCanceler.default()
  }
  router.beforeEach(async () => {
    // Switching the route will delete the previous request
    axiosCanceler?.removeAll()
    return true
  })
}

// Routing switch back to the top
function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href)
  }

  const body = document.body

  router.afterEach(async (to) => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0)
    return true
  })
}

/**
 * Used to close the message instance when the route is switched
 * @param router
 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = PROJECT_SETTING
  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll()
        notification.destroy()
      }
    } catch (error) {
      warn('message guard error:' + error)
    }
    return true
  })
}

export function createProgressGuard(router: Router) {
  const { computedOpenPageLoading } = useTransitionSettingHook()
  router.beforeEach(async (to) => {
    if (to.meta.loaded) {
      return true
    }
    unref(computedOpenPageLoading) && NProgress.start()
    return true
  })

  router.afterEach(async () => {
    unref(computedOpenPageLoading) && NProgress.done()
    return true
  })
}

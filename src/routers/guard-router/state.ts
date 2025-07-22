import type { Router } from 'vue-router'
import { useAppStore } from 'app-store'
import { useMultiTabsStore } from 'multi-tabs-store'
import { useUserStore } from 'user-store'
import { usePurviewStore } from 'purview-store'
import { PageType } from '@ems/pageTypes.ts'
import { removeRouteChangeListener } from 'app-logics'

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageType.BASE_LOGIN) {
      const multiTabsStore = useMultiTabsStore()
      const userStore = useUserStore()
      const appStore = useAppStore()
      const purviewStore = usePurviewStore()
      appStore.asyncResetAllState()
      purviewStore.resetContext()
      multiTabsStore.resetContext()
      userStore.resetContext()
      removeRouteChangeListener()
    }
  })
}

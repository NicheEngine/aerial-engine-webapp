import type { Router } from 'vue-router'
import { configureDynamicParamsMenu } from 'app-routers'
import { useAppStore } from 'app-store'

import { usePurviewStore } from 'purview-store'
import { PurviewType } from '@ems/appTypes.ts'
import type { MenuInfo } from 'app-routers'

export function createParamMenuGuard(router: Router) {
  const purviewStore = usePurviewStore()
  router.beforeEach(async (to, _, next) => {
    // filter no name route
    if (!to.name) {
      next()
      return
    }

    // menu has been built.
    if (!purviewStore.isDynamicAddedRoute) {
      next()
      return
    }

    let menus: MenuInfo[] = []
    if (isServerType()) {
      menus = purviewStore.getBackMenuInfos
    } else if (isRouteType()) {
      menus = purviewStore.getFrontMenuInfos
    }
    menus.forEach((item) => configureDynamicParamsMenu(item, to.params))

    next()
  })
}

const getPurviewType = () => {
  const appStore = useAppStore()
  return appStore.getProjectSetting().purviewType
}

const isServerType = () => {
  return getPurviewType() === PurviewType.SERVER
}

const isRouteType = () => {
  return getPurviewType() === PurviewType.ROUTE
}

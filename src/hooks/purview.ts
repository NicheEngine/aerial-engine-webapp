import type { RouteRecordRaw } from 'vue-router'

import { useAppStore } from 'app-store'
import { usePurviewStore } from 'purview-store'
import { useUserStore } from 'user-store'

import { useMultiTabsHook } from 'multi-tabs-hook'

import { router, resetRouter } from 'app-routers'
// import { ROOT_ROUTE } from 'system-routers'

import { PROJECT_SETTING } from 'app-settings'
import { PurviewType } from '@ems/appTypes.ts'
import { RoleType } from '@ems/roleTypes.ts'

import { intersection } from 'lodash-es'
import { isArray } from '@uts/staple.ts'
import { useMultiTabsStore } from 'multi-tabs-store'
import type { RouteRaw } from 'app-routers'

// User purview related operations
export function usePurviewHook() {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const purviewStore = usePurviewStore()
  const { closeAll } = useMultiTabsHook(router)

  async function togglePurviewType() {
    appStore.setProjectSetting({
      purviewMode:
        PROJECT_SETTING.purviewType === PurviewType.SERVER ? PurviewType.ROUTE : PurviewType.SERVER,
    })
    location.reload()
  }

  /**
   * Reset and regain authority resource information
   * 重置和重新获得权限资源信息
   */
  async function resumeResources() {
    const multiTabsStore = useMultiTabsStore()
    multiTabsStore.clearCacheTabs()
    resetRouter()
    const routes: RouteRaw[] = await purviewStore.asyncBuildRoutes()
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })
    purviewStore.setLastBuildMenuTime()
    await closeAll()
  }

  /**
   * Determine whether there is purview
   */
  function hasPurview(
    value?: RoleType | RoleType[] | string | string[],
    defaultValue = true,
  ): boolean {
    // Visible by default
    if (!value) {
      return defaultValue
    }

    const purviewType = PROJECT_SETTING.purviewType

    if ([PurviewType.ROUTE, PurviewType.ROLE].includes(purviewType)) {
      if (!isArray(value)) {
        return userStore.getUserRoles()?.includes(value as RoleType)
      }
      return (intersection(value, userStore.getUserRoles()) as RoleType[]).length > 0
    }

    if (PurviewType.SERVER === purviewType) {
      const purviewCodes = purviewStore.getPurviewCodes() as string[]
      if (!isArray(value)) {
        return purviewCodes.includes(value)
      }
      return (intersection(value, purviewCodes) as string[]).length > 0
    }
    return true
  }

  async function changeRole(roles: RoleType | RoleType[]): Promise<void> {
    if (PROJECT_SETTING.purviewType !== PurviewType.ROUTE) {
      throw new Error(
        'Please switch PurviewType to ROUTE_MAPPING mode in the configuration to operate!',
      )
    }

    if (!isArray(roles)) {
      roles = [roles]
    }
    userStore.setUserRoles(roles)
    await resumeResources()
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    await resumeResources()
  }

  return { changeRole, hasPurview, togglePurviewType, refreshMenu }
}

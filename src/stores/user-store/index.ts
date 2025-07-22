import { defineStore } from 'pinia'
import type { StoreDefinition, Store } from 'pinia'
import store from '@/stores'
import router from '@/routers'
import type { RouteRecordRaw } from 'vue-router'

import { ROLES_KEY, ACCESS_TOKEN_KEY, USER_INFO_KEY } from '@ems/cacheTypes'
import { getCache, setCache } from '@uts/cache.ts'
import { UserApi } from 'app-apis'
import { useI18nHook } from 'i18n-hook'
import { useMessageHook } from 'message-hook'
import { usePurviewStore } from 'purview-store'
import { NOT_FOUND_ROUTE } from 'system-routers'
import { isArray } from '@uts/staple.ts'
import { h, reactive } from 'vue'
import type { LoginParams, UserContext, UserStore } from 'user-store'
import type { UserInfo } from '@mds/info/userInfo.ts'
import { RoleType } from '@ems/roleTypes'
import { PageType } from '@ems/pageTypes'
import type { HttpErrorMode } from 'app-https'
import type { RouteRaw } from 'app-routers'

const storeId: string = 'user'

const storeOptions = (): UserStore => {
  const context: UserContext = reactive({
    /* user info */
    userInfo: null,
    /* token */
    accessToken: undefined,
    /* user roles */
    userRoles: [],
    /* whether the login expired */
    sessionTimeout: false,
    /* last fetch time  */
    lastUpdateTime: 0,
  })

  function getUserInfo(): UserInfo {
    return context.userInfo || getCache<UserInfo>(USER_INFO_KEY) || {}
  }

  function setUserInfo(userInfo: UserInfo | null): void {
    context.userInfo = userInfo
    context.lastUpdateTime = new Date().getTime()
    setCache(USER_INFO_KEY, userInfo)
  }

  function getAccessToken(): string {
    return context.accessToken || getCache<string>(ACCESS_TOKEN_KEY)
  }

  function setAccessToken(accessToken: string | undefined) {
    /* for null or undefined value */
    context.accessToken = accessToken ? accessToken : ''
    setCache(ACCESS_TOKEN_KEY, accessToken)
  }

  function getUserRoles(): RoleType[] {
    return context.userRoles.length > 0 ? context.userRoles : getCache<RoleType[]>(ROLES_KEY)
  }

  function setUserRoles(userRoles: RoleType[]): void {
    context.userRoles = userRoles
    setCache(ROLES_KEY, userRoles)
  }

  function isSessionTimeout(): boolean {
    return !!context.sessionTimeout
  }

  function setSessionTimeout(isSessionTimeout: boolean) {
    context.sessionTimeout = isSessionTimeout
  }

  function getLastUpdateTime(): number {
    return context.lastUpdateTime
  }

  function resetContext() {
    context.userInfo = null
    context.accessToken = ''
    context.userRoles = []
    context.sessionTimeout = false
  }

  async function asyncUserLogin(
    params: LoginParams & {
      goHome?: boolean
      mode?: HttpErrorMode
    },
  ): Promise<UserInfo | null> {
    try {
      const { goHome = true, mode, ...loginParams } = params
      const data = await UserApi.userLogin(loginParams, mode)
      const { accessToken } = data

      setAccessToken(accessToken)
      return asyncAfterLogin(goHome)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function asyncAfterLogin(isGoHome?: boolean): Promise<UserInfo | null> {
    if (!getAccessToken()) return null
    // get user info
    const userInfo = await asyncUserInfo()

    const sessionTimeout = context.sessionTimeout
    if (sessionTimeout) {
      setSessionTimeout(false)
    } else {
      const purviewStore = usePurviewStore()
      if (!purviewStore.isDynamicAddedRoute) {
        const routes: RouteRaw[] = await purviewStore.asyncBuildRoutes()
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw)
        })
        router.addRoute(NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
        purviewStore.setDynamicAddedRoute(true)
      }
      isGoHome && (await router.replace(userInfo?.homePath || PageType.BASE_HOME))
    }
    return userInfo
  }

  async function asyncUserInfo(): Promise<UserInfo | null> {
    if (!getAccessToken) return null
    const userInfo = getUserInfo()
    const { roles = [] } = userInfo
    if (isArray(roles)) {
      const roleList = roles.map((role) => role.value) as RoleType[]
      setUserRoles(roleList)
    } else {
      userInfo.roles = []
      setUserRoles([])
    }
    setUserInfo(userInfo)
    return userInfo
  }

  async function asyncUserLogout(isGoLogin: boolean = false) {
    if (getAccessToken()) {
      try {
        await UserApi.userLogout()
      } catch {
        console.log('注销Token失败')
      }
    }
    setAccessToken(undefined)
    setSessionTimeout(false)
    setUserInfo(null)
    isGoLogin && (await router.push(PageType.BASE_LOGIN))
  }

  function confirmLoginOut() {
    const { createConfirm } = useMessageHook()
    const { t } = useI18nHook()
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('sys.app.logoutMessage')),
      onOk: async () => {
        await asyncUserLogout(true)
      },
    })
  }

  return {
    /* 持久化 */
    persist: true,
    context,
    getUserInfo,
    setUserInfo,
    getAccessToken,
    setAccessToken,
    getUserRoles,
    setUserRoles,
    isSessionTimeout,
    setSessionTimeout,
    getLastUpdateTime,
    resetContext,
    asyncUserLogin,
    asyncAfterLogin,
    asyncUserInfo,
    asyncUserLogout,
    confirmLoginOut,
  } as UserStore
}

const userStore: StoreDefinition<
  string,
  Pick<UserStore, never>,
  Pick<UserStore, never>,
  Pick<UserStore, keyof UserStore>
> = defineStore(storeId, storeOptions)

export function useUserStore(): Store<
  string,
  Pick<UserStore, never>,
  Pick<UserStore, never>,
  Pick<UserStore, keyof UserStore>
> {
  return userStore(store)
}

export default userStore

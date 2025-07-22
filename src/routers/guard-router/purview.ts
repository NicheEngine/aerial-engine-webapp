import type { Router, RouteRecordRaw } from 'vue-router'
import { usePurviewStore } from 'purview-store'
import { PageType } from '@ems/pageTypes.ts'
import { useUserStore } from 'user-store'
import { NOT_FOUND_ROUTE, ROOT_ROUTE } from 'system-routers'
import type { RouteRaw } from 'app-routers'

const LOGIN_PATH = PageType.BASE_LOGIN

const ROOT_PATH = ROOT_ROUTE.path

const whitePathList: PageType[] = [LOGIN_PATH]

export function createPurviewGuard(router: Router) {
  const userStore = useUserStore()
  const purviewStore = usePurviewStore()
  router.beforeEach(async (to, from, next) => {
    if (
      from.path === ROOT_PATH &&
      to.path === PageType.BASE_HOME &&
      userStore.getUserInfo().homePath &&
      userStore.getUserInfo().homePath !== PageType.BASE_HOME
    ) {
      next(userStore.getUserInfo().homePath)
      return
    }

    const accessToken = userStore.getAccessToken

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageType)) {
      if (to.path === LOGIN_PATH && accessToken) {
        const isSessionTimeout = userStore.isSessionTimeout()
        try {
          await userStore.asyncAfterLogin()
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/')
            return
          }
        } catch {}
      }
      next()
      return
    }

    // token does not exist
    if (!accessToken) {
      // You can access without purview. You need to set the routing meta.ignoredAuth to true
      if (to.meta.ignoredAuth) {
        next()
        return
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        }
      }
      next(redirectData)
      return
    }

    // Jump to the 404 page after processing the login
    if (
      from.path === LOGIN_PATH &&
      to.name === NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo().homePath || PageType.BASE_HOME)
    ) {
      next(userStore.getUserInfo().homePath || PageType.BASE_HOME)
      return
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime() === 0) {
      try {
        await userStore.getUserInfo()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ignored: any) {
        next()
        return
      }
    }

    if (purviewStore.isDynamicAddedRoute()) {
      next()
      return
    }

    const routes: RouteRaw[] = await purviewStore.asyncBuildRoutes()

    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })

    router.addRoute(NOT_FOUND_ROUTE as unknown as RouteRecordRaw)

    purviewStore.setDynamicAddedRoute(true)

    if (to.name === NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      next(nextData)
    }
  })
}

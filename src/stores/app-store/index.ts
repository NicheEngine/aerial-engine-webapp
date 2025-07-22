import { defineStore } from 'pinia'
import type { StoreDefinition, Store } from 'pinia'
import type {
  ProjectSetting,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
} from 'app-settings'
import { ThemeModeType } from '@ems/appTypes'
import { APP_DARK_MODE_KEY_, PROJECT_SETTING_KEY } from '@ems/cacheTypes'
import { Persistent } from 'persistent-extend'
import { DARK_MODE } from 'app-settings'
import { resetRouter } from '@/routers'
import { deepMerge } from '@uts/common.ts'
import type { AppStore, AppContext, BeforeMiniState } from 'app-store'
import { reactive } from 'vue'
import store from '@/stores'

const storeId: string = 'app'

const storeOptions = (): AppStore => {
  let timeId: TimeoutHandle

  const context: AppContext = reactive({
    themeMode: undefined,
    pagesLoading: false,
    projectSetting: Persistent.getLocal(PROJECT_SETTING_KEY),
    beforeMiniInfo: {} as BeforeMiniState,
  })

  function getThemeMode(): string | 'light' | 'dark' {
    return context.themeMode || localStorage.getItem(APP_DARK_MODE_KEY_) || DARK_MODE
  }

  function setThemeMode(themeMode: ThemeModeType): void {
    context.themeMode = themeMode
    localStorage.setItem(APP_DARK_MODE_KEY_, themeMode)
  }

  function getPagesLoading(): boolean {
    return context.pagesLoading
  }

  function setPagesLoading(pagesLoading: boolean): void {
    context.pagesLoading = pagesLoading
  }

  function getProjectSetting(): ProjectSetting {
    return context.projectSetting || ({} as ProjectSetting)
  }

  function setProjectSetting(projectSetting: DeepPartial<ProjectSetting>): void {
    context.projectSetting = deepMerge(context.projectSetting || {}, projectSetting)
    Persistent.setLocal(PROJECT_SETTING_KEY, context.projectSetting)
  }

  function getBeforeMiniInfo(): BeforeMiniState {
    return context.beforeMiniInfo
  }

  function setBeforeMiniInfo(beforeMiniInfo: BeforeMiniState): void {
    context.beforeMiniInfo = beforeMiniInfo
  }

  function getHeaderSetting(): HeaderSetting {
    return getProjectSetting()?.headerSetting
  }

  function getMenuSetting(): MenuSetting {
    return getProjectSetting()?.menuSetting
  }

  function getTransitionSetting(): TransitionSetting {
    return getProjectSetting()?.transitionSetting
  }

  function getMultiTabsSetting(): MultiTabsSetting {
    return getProjectSetting()?.multiTabsSetting
  }

  async function asyncPagesLoading(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId)
      // Prevent flicker
      timeId = setTimeout(() => {
        setPagesLoading(loading)
      }, 50)
    } else {
      setPagesLoading(loading)
      clearTimeout(timeId)
    }
  }

  async function asyncResetAllState() {
    resetRouter()
    Persistent.clearAll()
  }

  return {
    /* 持久化 */
    persist: true,
    getThemeMode,
    setThemeMode,
    getPagesLoading,
    setPagesLoading,
    getProjectSetting,
    setProjectSetting,
    getBeforeMiniInfo,
    setBeforeMiniInfo,
    getHeaderSetting,
    getMenuSetting,
    getTransitionSetting,
    getMultiTabsSetting,
    asyncPagesLoading,
    asyncResetAllState,
  } as AppStore
}

const appStore: StoreDefinition<
  string,
  Pick<AppStore, never>,
  Pick<AppStore, never>,
  Pick<AppStore, keyof AppStore>
> = defineStore(storeId, storeOptions)

export function useAppStore(): Store<
  string,
  Pick<AppStore, never>,
  Pick<AppStore, never>,
  Pick<AppStore, keyof AppStore>
> {
  return appStore(store)
}

export default appStore

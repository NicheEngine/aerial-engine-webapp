declare module 'app-store' {
  import type {
    HeaderSetting,
    MenuSetting,
    MultiTabsSetting,
    ProjectSetting,
    TransitionSetting,
  } from 'app-settings'
  import { ThemeModeType } from '@ems/appTypes'
  import type { MenuStyleType, MenuModeType } from '@ems/menuTypes.ts'
  import type { DefineStoreOptionsBase } from 'pinia'

  export interface BeforeMiniState {
    menuCollapsed?: boolean
    menuSplit?: boolean
    menuMode?: MenuModeType
    menuType?: MenuStyleType
  }

  export interface AppContext {
    /**
     * theme dark Mode
     */
    themeMode?: ThemeModeType
    /**
     * Page loading status
     */
    pagesLoading: boolean
    /**
     * project setting
     */
    projectSetting: ProjectSetting | null
    /**
     * When the window shrinks, remember some states,
     * and restore these states when the window is restored
     */
    beforeMiniInfo: BeforeMiniState
  }

  export interface AppStore extends DefineStoreOptionsBase {
    getThemeMode: () => ThemeModeType
    setThemeMode: (themeMode: ThemeModeType) => void
    getPagesLoading: () => boolean
    setPagesLoading: (pagesLoading: boolean) => void
    getProjectSetting: () => ProjectSetting
    setProjectSetting: (projectSetting: DeepPartial<ProjectSetting>) => void
    getBeforeMiniInfo: () => BeforeMiniState
    setBeforeMiniInfo: (beforeMiniInfo: BeforeMiniState) => void
    getHeaderSetting: () => HeaderSetting
    getMenuSetting: () => MenuSetting
    getTransitionSetting: () => TransitionSetting
    getMultiTabsSetting: () => MultiTabsSetting
    asyncPagesLoading: (pagesLoading: boolean) => Promise<void>
    asyncResetAllState: () => void
  }

  export { appStore, useAppStore } from './index.ts'
}

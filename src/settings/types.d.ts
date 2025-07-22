declare module 'app-settings' {
  import { MenuModeType, TriggerType, MixSidebarTriggerType, MenuStyleType } from '@ems/menuTypes'
  import {
    ContentWidthType,
    PurviewType,
    ThemeModeType,
    RouterTransitionType,
    SettingButtonType,
    SessionTimeoutType,
  } from '@ems/appTypes'

  import { CacheType } from '@ems/cacheTypes'

  import type { LocaleType } from 'app-locales'

  export interface MenuSetting {
    bgColor: string
    fixed: boolean
    collapsed: boolean
    siderHidden: boolean
    canDrag: boolean
    show: boolean
    hidden: boolean
    split: boolean
    menuWidth: number
    mode: MenuModeType | string
    type: MenuStyleType | string
    theme: ThemeModeType | string
    topMenuAlign: 'start' | 'center' | 'end'
    trigger: TriggerType
    accordion: boolean
    closeMixSidebarOnChange: boolean
    collapsedShowTitle: boolean
    mixSideTrigger: MixSidebarTriggerType
    mixSideFixed: boolean
  }

  export interface MultiTabsSetting {
    cache: boolean
    show: boolean
    showQuick: boolean
    canDrag: boolean
    showRedo: boolean
    showFold: boolean
  }

  export interface HeaderSetting {
    bgColor: string
    fixed: boolean
    show: boolean
    theme: ThemeModeType
    // Turn on full screen
    showFullScreen: boolean
    // Whether to show the lock screen
    useLockPage: boolean
    // Show document button
    showDoc: boolean
    // Show message center button
    showNotice: boolean
    showSearch: boolean
  }

  export interface LocaleSetting {
    showPicker: boolean
    // Current language
    locale: LocaleType
    // default language
    fallback: LocaleType
    // available Locales
    availableLocales: LocaleType[]
  }

  export interface TransitionSetting {
    //  Whether to open the page switching animation
    enable: boolean
    // Route basic switching animation
    basicTransition: RouterTransitionType
    // Whether to open page switching loading
    openPageLoading: boolean
    // Whether to open the top progress bar
    openNProgress: boolean
  }

  export interface ProjectSetting {
    // Storage location of purview related information
    purviewCacheType: CacheType
    // Whether to show the configuration button
    showSettingButton: boolean
    // Whether to show the theme switch button
    showDarkModeToggle: boolean
    // Configure where the button is displayed
    settingButtonPosition: SettingButtonType
    // Purview type
    purviewType: PurviewType
    // Session timeout processing
    sessionTimeoutType: SessionTimeoutType
    // Website gray mode, open for possible mourning dates
    grayMode: boolean
    // Whether to turn on the color weak mode
    colorWeak: boolean
    // Theme color
    themeColor: string

    // The main interface is displayed in full screen, the menu is not displayed, and the top
    fullContent: boolean
    // content width
    contentMode: ContentWidthType
    // Whether to display the logo
    showLogo: boolean
    // Whether to show the global footer
    showFooter: boolean
    // menuType: MenuType;
    headerSetting: HeaderSetting
    // menuSetting
    menuSetting: MenuSetting
    // Multi-tab settings
    multiTabsSetting: MultiTabsSetting
    // Animation configuration
    transitionSetting: TransitionSetting
    // pageLayout whether to enable keep-alive
    openKeepAlive: boolean
    // Locked screen time
    lockedTime: number
    // Show breadcrumbs
    showBreadCrumb: boolean
    // Show breadcrumb icon
    showBreadCrumbIcon: boolean
    // Use error-handler-plugin
    useErrorHandle: boolean
    // Whether to open back to top
    useOpenBackTop: boolean
    // Is it possible to embed iframe pages
    canEmbedIFramePage: boolean
    // Whether to delete unclosed messages and notify when switching the interface
    closeMessageOnSwitch: boolean
    // Whether to cancel the http request that has been sent but not responded when switching the interface.
    removeAllHttpPending: boolean
  }

  export type RootSetting = Omit<
    ProjectSetting,
    'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'
  >

  export interface AppGlobSetting {
    // Site name
    name: string
    // Site title
    title: string
    // Service interface url
    apiUrl: string
    // Upload url
    uploadUrl?: string
    //  Service interface url prefix
    urlPrefix?: string
    // Project abbreviation
    shortName: string
  }

  export { COMPONENT_SETTINGS } from './component.ts'
  export {
    PREFIX_CLS,
    DARK_MODE,
    APP_PRESET_COLOR_LIST,
    HEADER_PRESET_BG_COLOR_LIST,
    SIDE_BAR_BG_COLOR_LIST,
  } from './design.ts'
  export { DEFAULT_CACHE_TIME, DEFAULT_CACHE_CIPHER, ENABLE_STORAGE_ENCRYPT } from './encrypt.ts'
  export { LOCALE, LOCALE_SETTING, LOCALE_DROPDOWNS } from './locale.ts'
  export { PROJECT_SETTING } from './project.ts'
}

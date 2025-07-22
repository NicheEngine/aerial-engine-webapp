declare module 'persistent-extend' {
  import {
    ACCESS_TOKEN_KEY,
    LOCKED_INFO_KEY,
    MULTI_TABS_KEY,
    PROJECT_SETTING_KEY,
    ROLES_KEY,
    USER_INFO_KEY,
  } from '@ems/cacheTypes.ts'
  import type { UserInfo } from '@mds/info/userInfo.ts'
  import type { LockedInfo } from 'locked-store'
  import type { ProjectSetting } from 'app-settings'
  import type { RouteLocationNormalized } from 'vue-router'

  export interface BasicStore {
    [ACCESS_TOKEN_KEY]: string | number | null | undefined
    [USER_INFO_KEY]: UserInfo
    [ROLES_KEY]: string[]
    [LOCKED_INFO_KEY]: LockedInfo
    [PROJECT_SETTING_KEY]: ProjectSetting
    [MULTI_TABS_KEY]: RouteLocationNormalized[]
  }

  export type LocalStore = BasicStore

  export type SessionStore = BasicStore

  export type BasicKeys = keyof BasicStore
  export type LocalKeys = keyof LocalStore
  export type SessionKeys = keyof SessionStore

  export { Persistent } from 'index.ts'
}

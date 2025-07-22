declare module 'user-store' {
  import type { RoleType } from '@ems/roleTypes'
  import type { ErrorMessageMode } from '@tps/axios'
  import type { DefineStoreOptionsBase } from 'pinia'
  import type { UserInfo } from '@mds/info/userInfo.ts'
  import type { RoleInfo } from '@mds/info/roleInfo.ts'

  export interface LoginParams {
    username: string
    password: string
  }

  export interface LoginResult {
    userId: string | number
    token: string
    role: RoleInfo
  }

  export interface UserContext {
    userInfo: Nullable<UserModel>
    accessToken?: string
    userRoles: RoleType[]
    sessionTimeout?: boolean
    lastUpdateTime: number
  }

  export interface UserStore extends DefineStoreOptionsBase {
    context: UserContext
    getUserInfo: () => UserInfo
    setUserInfo: (userInfo: UserInfo | null) => void
    getAccessToken: () => string
    setAccessToken: (accessToken: string | undefined) => void
    getUserRoles: () => RoleType[]
    setUserRoles: (userRoles: RoleType[]) => void
    isSessionTimeout: () => boolean
    setSessionTimeout: (isSessionTimeout: boolean) => void
    getLastUpdateTime: () => number
    resetContext: () => void
    asyncUserLogin: (
      params: LoginParams & { goHome?: boolean; mode?: ErrorMessageMode },
    ) => Promise<UserInfo | null>
    asyncAfterLogin: (isGoHome?: boolean) => Promise<UserInfo | null>
    asyncUserInfo: () => Promise<UserInfo | null>
    asyncUserLogout: (isGoLogin: boolean) => void
    confirmLoginOut: () => void
  }

  export { userStore, useUserStore } from './index.ts'
}

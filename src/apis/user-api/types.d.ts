declare module 'user-api' {
  export interface LoginRequest {
    username: string
    password: string
  }

  export interface LoginResult {
    userId: string | number
    token: string
    role: RoleModel
  }

  export interface RoleModel {
    roleName: string
    value: string
  }

  export interface UserModel {
    roles: RoleModel[]
    id: string | number
    name: string
    description?: string
    userId: string | number
    username: string
    realName?: string
    nickname?: string
    avatar: string
  }

  export enum ApiUrl {
    LOGIN = '/login',
    LOGOUT = '/logout',
    USER_INFO = '/userInfo',
    TEST_RETRY = '/testRetry',
  }
}

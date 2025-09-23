declare module 'user-store' {
  import type { DefineStoreOptionsBase } from 'pinia';

  export interface UserInfo {
    [key: string]: any;
    avatar: string;
    realName: string;
    roles?: string[];
    userId: string;
    username: string;
  }

  export interface UserContext {
    userInfo: null | UserInfo;
    userRoles: string[];
  }

  export interface UserStore extends DefineStoreOptionsBase {
    context: UserContext;
    getUserInfo: () => null | UserInfo;
    getUserRoles: () => string[];
    resetContext: () => void;
    setUserInfo: (userInfo: null | UserInfo) => void;
    setUserRoles: (userRoles: string[]) => void;
  }

  export { userStore, useUserStore } from './index.ts';
}

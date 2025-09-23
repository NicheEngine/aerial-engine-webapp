import type { DefineSetupStoreOptions, StateTree } from 'pinia';

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

export interface UserStore
  extends DefineSetupStoreOptions<string, StateTree, any, any> {
  context: UserContext;
  getUserInfo: () => null | UserInfo;
  getUserRoles: () => string[];
  resetContext: () => void;
  setUserInfo: (userInfo: null | UserInfo) => void;
  setUserRoles: (userRoles: string[]) => void;
}

import type { DefineSetupStoreOptions, StateTree } from 'pinia';

export interface UserCache {
  home?: string;
  token: string;
}

export interface UserInfo extends UserCache {
  [key: string]: any;
  avatar?: string;
  id: string;
  nickname: string;
  username: string;
}

export interface UserContext {
  userInfo: null | UserInfo;
  userRoles: string[];
}

export interface UserStore
  extends DefineSetupStoreOptions<string, StateTree, any, any> {
  $reset: () => void;
  context: UserContext;
  getUserInfo: () => null | UserInfo;
  getUserRoles: () => string[];
  resetContext: () => void;
  setUserInfo: (userInfo: null | UserInfo) => void;
  setUserRoles: (userRoles: string[]) => void;
}

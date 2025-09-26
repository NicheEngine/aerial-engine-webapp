import type { DefineSetupStoreOptions, StateTree } from 'pinia';

import type { RouteRecordRaw } from 'vue-router';

import type { MenuRecordRaw } from '@engine-core/typings';

export type AccessToken = null | string;

export interface AccessContext {
  /**
   * 权限码
   */
  accessCodes: string[];
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[];
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken;
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean;
  /**
   * 是否锁屏状态
   */
  isLockScreen: boolean;
  /**
   * 锁屏密码
   */
  lockScreenPassword?: string;
  /**
   * 登录是否过期
   */
  loginExpired: boolean;
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken;
}

export interface AccessStore
  extends DefineSetupStoreOptions<string, StateTree, any, any> {
  $reset: () => void;
  context: AccessContext;
  getMenuByPath: (path: string) => MenuRecordRaw | undefined;
  lockScreen: (password: string) => void;
  resetContext: () => void;
  setAccessCodes: (codes: string[]) => void;
  setAccessMenus: (menus: MenuRecordRaw[]) => void;
  setAccessRoutes: (routes: RouteRecordRaw[]) => void;
  setAccessToken: (accessToken: AccessToken) => void;
  setIsAccessChecked: (isAccessChecked: boolean) => void;
  setLoginExpired: (loginExpired: boolean) => void;
  setRefreshToken: (refreshToken: AccessToken) => void;
  unlockScreen: () => void;
}

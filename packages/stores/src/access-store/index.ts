import type { AccessContext, AccessStore, AccessToken } from 'access-store';
import type { Store, StoreDefinition } from 'pinia';

import type { RouteRecordRaw } from 'vue-router';

import type { MenuRecordRaw } from '@engine-core/typings';

import { reactive } from 'vue';

import { acceptHMRUpdate, defineStore } from 'pinia';

import store from '../index';

const storeId: string = 'access';

const storeOptions = (): AccessStore => {
  const context: AccessContext = reactive({
    accessCodes: [],
    accessMenus: [],
    accessRoutes: [],
    accessToken: null,
    isAccessChecked: false,
    isLockScreen: false,
    lockScreenPassword: undefined,
    loginExpired: false,
    refreshToken: null,
  });

  function getMenuByPath(path: string): MenuRecordRaw | undefined {
    function findMenu(
      menus: MenuRecordRaw[],
      path: string,
    ): MenuRecordRaw | undefined {
      for (const menu of menus) {
        if (menu.path === path) {
          return menu;
        }
        if (menu.children) {
          const matched = findMenu(menu.children, path);
          if (matched) {
            return matched;
          }
        }
      }
    }

    return findMenu(context.accessMenus, path);
  }

  function lockScreen(password: string): void {
    context.isLockScreen = true;
    context.lockScreenPassword = password;
  }

  function setAccessCodes(codes: string[]): void {
    context.accessCodes = codes;
  }

  function setAccessMenus(menus: MenuRecordRaw[]) {
    context.accessMenus = menus;
  }

  function setAccessRoutes(routes: RouteRecordRaw[]) {
    context.accessRoutes = routes;
  }

  function setAccessToken(token: AccessToken) {
    context.accessToken = token;
  }

  function setIsAccessChecked(isAccessChecked: boolean) {
    context.isAccessChecked = isAccessChecked;
  }

  function setLoginExpired(loginExpired: boolean) {
    context.loginExpired = loginExpired;
  }

  function setRefreshToken(token: AccessToken) {
    context.refreshToken = token;
  }

  function unlockScreen() {
    context.isLockScreen = false;
    context.lockScreenPassword = undefined;
  }

  function resetContext() {
    context.accessCodes = [];
    context.accessMenus = [];
    context.accessRoutes = [];
    context.accessToken = null;
    context.isAccessChecked = false;
    context.isLockScreen = false;
    context.lockScreenPassword = undefined;
    context.loginExpired = false;
    context.refreshToken = null;
  }

  return {
    /* 持久化 */
    persist: {
      pick: [
        context.accessToken,
        context.refreshToken,
        context.accessCodes,
        context.isLockScreen,
        context.lockScreenPassword,
      ],
    },
    context,
    getMenuByPath,
    lockScreen,
    setAccessCodes,
    setAccessMenus,
    setAccessRoutes,
    setAccessToken,
    setIsAccessChecked,
    setLoginExpired,
    setRefreshToken,
    unlockScreen,
    resetContext,
  } as AccessStore;
};

const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAccessStore, hot));
}

const accessStore: StoreDefinition<
  string,
  Pick<AccessStore, never>,
  Pick<AccessStore, never>,
  Pick<AccessStore, keyof AccessStore>
> = defineStore(storeId, storeOptions);

export function useAccessStore(): Store<
  string,
  Pick<AccessStore, never>,
  Pick<AccessStore, never>,
  Pick<AccessStore, keyof AccessStore>
> {
  return accessStore(store);
}

export function createAccessStore(): Store<
  string,
  Pick<AccessStore, never>,
  Pick<AccessStore, never>,
  Pick<AccessStore, keyof AccessStore>
> {
  return accessStore();
}

export default accessStore;

import type { Store, StoreDefinition } from 'pinia';
import type { UserContext, UserInfo, UserStore } from 'user-store';

import { reactive } from 'vue';

import { acceptHMRUpdate, defineStore } from 'pinia';

import store from '../index';

const storeId: string = 'user';

const storeOptions = (): UserStore => {
  const context: UserContext = reactive({
    /* user info */
    userInfo: null,
    /* user roles */
    userRoles: [],
  });

  function getUserInfo(): null | UserInfo {
    return context.userInfo;
  }

  function setUserInfo(userInfo: null | UserInfo): void {
    context.userInfo = userInfo;
  }

  function getUserRoles(): string[] {
    return context.userRoles;
  }

  function setUserRoles(userRoles: string[]): void {
    context.userRoles = userRoles;
  }

  function resetContext() {
    context.userInfo = null;
    context.userRoles = [];
  }

  return {
    /* 持久化 */
    persist: {
      pick: [context.userInfo, context.userRoles],
    },
    context,
    getUserInfo,
    setUserInfo,
    getUserRoles,
    setUserRoles,
    resetContext,
  } as UserStore;
};

const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}

const userStore: StoreDefinition<
  string,
  Pick<UserStore, never>,
  Pick<UserStore, never>,
  Pick<UserStore, keyof UserStore>
> = defineStore(storeId, storeOptions);

export function useUserStore(): Store<
  string,
  Pick<UserStore, never>,
  Pick<UserStore, never>,
  Pick<UserStore, keyof UserStore>
> {
  return userStore(store);
}

export function createUserStore(): Store<
  string,
  Pick<UserStore, never>,
  Pick<UserStore, never>,
  Pick<UserStore, keyof UserStore>
> {
  return userStore();
}

export default userStore;

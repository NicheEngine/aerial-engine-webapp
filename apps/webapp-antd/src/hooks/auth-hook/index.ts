import type { UserInfo } from '@engine/stores';
import type { Recordable } from '@engine/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@engine/constants';
import { preferences } from '@engine/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@engine/stores';

import { notification } from 'ant-design-vue';

import loginApi from '#/apis/login-api';
import { $t } from '#/locales';

export function useAuthHook() {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref<boolean>(false);

  async function loginHook(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const { token: accessToken, user } = await loginApi.password(params);
      userInfo = user;
      // 如果成功获取到 accessToken
      if (accessToken) {
        accessStore.setAccessToken(accessToken);

        userStore.setUserInfo(userInfo);
        // accessStore.setAccessCodes(accessCodes);

        if (accessStore.context.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.home || preferences.app.defaultHomePath,
              );
        }

        if (userInfo.nickname) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo.nickname}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logoutHook(redirect: boolean = true) {
    try {
      await loginApi.logout();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function userHook() {
    const userInfo = await loginApi.info();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function resetHook() {
    loginLoading.value = false;
  }

  return {
    resetHook,
    loginHook,
    userHook,
    loginLoading,
    logoutHook,
  };
}

export default useAuthHook;

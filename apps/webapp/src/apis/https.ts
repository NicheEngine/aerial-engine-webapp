import type { AxiosHttpRequestConfig } from '@engine/https';

import { useAppConfig } from '@engine/hooks';
import { createAxios } from '@engine/https';
import { preferences } from '@engine/preferences';
import { useAccessStore } from '@engine/stores';
import { merge } from '@engine/utils';

import { message } from 'ant-design-vue';

import { useAuthHook } from '#/hooks/auth-hook';

import loginApi from './login-api';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

async function authenticate() {
  console.warn('Access token or refresh token is invalid or expired. ');
  const accessStore = useAccessStore();
  const authHook = useAuthHook();
  accessStore.setAccessToken(null);
  if (
    preferences.app.loginExpiredMode === 'modal' &&
    accessStore.context.isAccessChecked
  ) {
    accessStore.setLoginExpired(true);
  } else {
    await authHook.logoutHook();
  }
}

async function refreshToken() {
  const accessStore = useAccessStore();
  const result = await loginApi.refresh();
  const refreshToken = result.token;
  accessStore.setAccessToken(refreshToken);
  return refreshToken;
}

function accessToken() {
  const accessStore = useAccessStore();
  return accessStore.context.accessToken;
}

function messageHandler(resultMessage: string, error: any) {
  // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，
  // 根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
  // 当前mock接口返回的错误字段是 error 或者 message
  const responseData = error?.response?.data ?? {};
  const errorMessage = responseData?.error ?? responseData?.message ?? '';
  // 如果没有错误信息，则会根据状态码进行提示
  message.error(errorMessage || resultMessage).then(() => {});
}

function createHttp(config?: Partial<AxiosHttpRequestConfig>) {
  return createAxios(
    merge(
      {
        baseURL: apiURL,
        authToken: {
          authenticate,
          accessToken,
          isRefreshToken: preferences.app.enableRefreshToken,
          refreshToken,
          tokenPrefix: 'Bearer',
          unauthorizedStatus: [401, 11_500, 11_501, 11_502, 11_503],
        },
        result: {
          errorLog: true,
          dataField: 'data',
          messageHandler,
          statusField: 'status',
          successStatus: 200,
        },
      } as AxiosHttpRequestConfig,
      config || {},
    ),
  );
}

export const defaultHttp = createHttp({
  options: {
    apiUrl: '/api',
    urlPrefix: '/aerial',
  },
});

// other apis url
export const serverHttp = createAxios({
  options: {
    apiUrl: '/server',
    urlPrefix: '/aerial',
  },
});

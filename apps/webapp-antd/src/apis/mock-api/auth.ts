import { mockHttp } from '../https';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return mockHttp.post<AuthApi.LoginResult>({
    url: '/auth/login',
    data,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return mockHttp.post<AuthApi.RefreshTokenResult>({
    url: '/auth/refresh',
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return mockHttp.post({
    url: '/auth/logout',
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return mockHttp.get<string[]>({
    url: '/auth/codes',
  });
}

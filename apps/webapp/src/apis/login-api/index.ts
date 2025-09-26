import type { LoginResult, PasswordBody, TokenBody } from 'login-api';
import type { UserModel } from 'user-api';

import { defaultHttp } from '../https';
import Api from './api';

export const loginApi = {
  async password(body: PasswordBody): Promise<LoginResult> {
    return defaultHttp.post<LoginResult>({
      url: Api.password,
      data: body,
    });
  },
  async token(token: string): Promise<LoginResult> {
    return defaultHttp.post<LoginResult>({
      url: Api.token,
      data: {
        token,
      } as TokenBody,
    });
  },
  async refresh(): Promise<LoginResult> {
    return defaultHttp.post<LoginResult>({
      url: Api.refresh,
    });
  },
  async logout(): Promise<void> {
    return defaultHttp.get({
      url: Api.logout,
    });
  },
  async info(): Promise<UserModel> {
    return defaultHttp.get<UserModel>({
      url: Api.info,
    });
  },
};

export default loginApi;

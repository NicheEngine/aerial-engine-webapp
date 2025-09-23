import type { PasswordBody, TokenBody } from 'login-api';
import type { UserModel } from 'user-api';

import { defaultHttp } from '../axios-https';
import Api from './api';

export const LoginApi = {
  async password(account: string, password: string): Promise<UserModel> {
    return defaultHttp.post<UserModel>({
      url: Api.password,
      data: {
        account,
        password,
      } as PasswordBody,
    });
  },
  async token(token: string): Promise<UserModel> {
    return defaultHttp.post<UserModel>({
      url: Api.token,
      data: {
        token,
      } as TokenBody,
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

export default LoginApi;

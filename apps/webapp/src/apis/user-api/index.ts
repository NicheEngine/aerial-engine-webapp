import type { PageResult } from 'rest-api';
import type { UserFilter, UserModel } from 'user-api';

import { defaultHttp } from '#/apis/https';

import Api from './api';

export const userApi = {
  async createUser(userModel: UserModel): Promise<UserModel> {
    return defaultHttp.post<UserModel>({
      url: Api.create,
      data: userModel,
    });
  },
  async updateUser(userModel: UserModel): Promise<UserModel> {
    return defaultHttp.post<UserModel>({
      url: Api.update,
      data: userModel,
    });
  },
  async queryUserById(id: string): Promise<UserModel> {
    return defaultHttp.get<UserModel>({
      url: Api.queryId(id),
    });
  },
  async queryUserByFilter(filter: UserFilter): Promise<PageResult<UserModel>> {
    return defaultHttp.post<PageResult<UserModel>>({
      url: Api.queryFilter,
      data: filter,
    });
  },
  async deleteUserById(id: string): Promise<void> {
    return defaultHttp.delete({
      url: Api.deleteId(id),
    });
  },
  async deleteUserByFilter(filter: UserFilter): Promise<void> {
    return defaultHttp.post({
      url: Api.deleteFilter,
      data: filter,
    });
  },
};

export default userApi;

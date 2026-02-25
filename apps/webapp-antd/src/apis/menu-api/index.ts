import type { MenuFilter, MenuModel } from 'menu-api';
import type { PageResult } from 'rest-api';

import { defaultHttp } from '#/apis/https';

import Api from './api';

export const MenuApi = {
  async saveMenu(menuModel: MenuModel): Promise<MenuModel> {
    return defaultHttp.post<MenuModel>({
      url: Api.save,
      data: menuModel,
    });
  },
  async queryMenuByFilter(filter: MenuFilter): Promise<PageResult<MenuModel>> {
    return defaultHttp.post<PageResult<MenuModel>>({
      url: Api.queryFilter,
      data: filter,
    });
  },
};

export default MenuApi;

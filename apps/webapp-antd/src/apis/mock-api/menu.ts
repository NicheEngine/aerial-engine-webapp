import type { RouteRecordStringComponent } from '@engine/types';

import { mockHttp } from '../https';

export async function getAllMenusApi() {
  return mockHttp.get<RouteRecordStringComponent[]>({
    url: '/menu/all',
  });
}

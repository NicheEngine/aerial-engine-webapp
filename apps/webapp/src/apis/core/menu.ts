import type { RouteRecordStringComponent } from '@engine/types';

import { requestClient } from '#/apis/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

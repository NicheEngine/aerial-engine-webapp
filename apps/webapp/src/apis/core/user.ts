import type { UserInfo } from '@engine/types';

import { requestClient } from '#/apis/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

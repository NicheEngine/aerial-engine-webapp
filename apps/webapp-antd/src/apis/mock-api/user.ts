import type { UserInfo } from '@engine/types';

import { mockHttp } from '../https';

export async function getUserInfoApi() {
  return mockHttp.get<UserInfo>({
    url: '/user/info',
  });
}

declare module 'user-api' {
  import type { InfoModel, RestFilter } from 'rest-api';

  import type { UserInfo } from '@engine/stores';

  export interface UserModel extends InfoModel, UserInfo {
    workspaceId: string;
    password: string;
    roleKeys?: string[];
    purviewKeys?: string[];
    roleValue?: number;
    purviewValue?: number;
  }

  export interface UserFilter extends RestFilter {
    workspaceId: string;
    loadSuper: boolean;
    loadBase: boolean;
    loadDefault: boolean;
  }
}

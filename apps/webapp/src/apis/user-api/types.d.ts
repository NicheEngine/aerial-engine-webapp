declare module 'user-api' {
  import type { InfoModel, RestFilter } from 'rest-api';

  export * from './api';
  export * from './index';

  export interface UserModel extends InfoModel {
    workspaceId: string;
    username: string;
    password: string;
    roleKeys: string[];
    purviewKeys: string[];
    roleValue: number;
    purviewValue: number;
  }

  export interface UserFilter extends RestFilter {
    workspaceId: string;
    loadSuper: boolean;
    loadBase: boolean;
    loadDefault: boolean;
  }
}

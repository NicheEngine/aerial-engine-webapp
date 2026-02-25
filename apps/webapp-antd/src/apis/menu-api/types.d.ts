declare module 'menu-api' {
  import type { RestFilter } from 'rest-api';

  import type { RouteMeta, RouteRecordStringComponent } from '@engine/types';

  export interface MenuModel extends RouteRecordStringComponent {
    name: string;
    path: string;
    redirect?: string;
    component?: string;
    meta: RouteMeta;
    children?: MenuModel[];
  }

  export interface MenuFilter extends RestFilter {
    workspaceId: string;
    loadBase: boolean;
    loadChildren: boolean;
  }
}

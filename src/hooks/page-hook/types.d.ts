declare module 'page-hook' {
  import { PageType } from '@ems/pageTypes.ts'
  import type { RouteLocationRaw } from 'vue-router'
  export type PathAsPageEnum<T> = T extends { path: string } ? T & { path: PageType } : T
  export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw>
  export { useGotoRouteHook, useRedoRouteHook } from './index.ts'
}

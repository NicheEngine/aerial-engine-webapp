import type { DefineSetupStoreOptions, StateTree } from 'pinia';

import type { ComputedRef } from 'vue';
import type { Router, RouteRecordNormalized } from 'vue-router';

import type { TabDefinition } from '@engine-core/typings';

export interface TabbarContext {
  /**
   * @zh_CN 当前打开的标签页列表缓存
   */
  cachedTabs: Set<string>;
  /**
   * @zh_CN 拖拽结束的索引
   */
  dragEndIndex: number;
  /**
   * @zh_CN 需要排除缓存的标签页
   */
  excludeCachedTabs: Set<string>;
  /**
   * @zh_CN 标签右键菜单列表
   */
  menuList: string[];
  /**
   * @zh_CN 是否刷新
   */
  renderRouteView?: boolean;
  /**
   * @zh_CN 当前打开的标签页列表
   */
  tabs: TabDefinition[];
  /**
   * @zh_CN 更新时间，用于一些更新场景，使用watch深度监听的话，会损耗性能
   */
  updateTime?: number;
}

export interface TabbarStore
  extends DefineSetupStoreOptions<string, StateTree, any, any> {
  _bulkCloseByKeys: (keys: string[]) => Promise<void>;
  _close: (tab: TabDefinition) => void;
  _goToDefaultTab: (router: Router) => Promise<void>;
  _goToTab: (tab: TabDefinition, router: Router) => Promise<void>;
  addTab: (routeTab: TabDefinition) => TabDefinition;
  affixTabs: () => TabDefinition[];
  closeAllTabs: (router: Router) => Promise<void>;
  closeLeftTabs: (tab: TabDefinition) => Promise<void>;
  closeOtherTabs: (tab: TabDefinition) => Promise<void>;
  closeRightTabs: (tab: TabDefinition) => Promise<void>;
  closeTab: (tab: TabDefinition, router: Router) => Promise<void>;
  closeTabByKey: (key: string, router: Router) => Promise<void>;
  context: TabbarContext;
  getCachedTabs: () => string[];
  getExcludeCachedTabs: () => string[];
  getMenuList: () => string[];
  getTabByKey: (key: string) => TabDefinition;
  getTabs: () => TabDefinition[];
  openTabInNewWindow: (tab: TabDefinition) => Promise<void>;
  pinTab: (tab: TabDefinition) => Promise<void>;
  refresh: (router: Router | string) => Promise<void>;
  refreshByName: (name: string) => Promise<void>;
  resetContext: () => void;
  resetTabTitle: (tab: TabDefinition) => Promise<void>;
  setAffixTabs: (tabs: RouteRecordNormalized[]) => void;
  setMenuList: (list: string[]) => void;
  setTabTitle: (
    tab: TabDefinition,
    title: ComputedRef<string> | string,
  ) => Promise<void>;
  setUpdateTime: () => void;
  sortTabs: (oldIndex: number, newIndex: number) => Promise<void>;
  toggleTabPin: (tab: TabDefinition) => Promise<void>;
  unpinTab: (tab: TabDefinition) => Promise<void>;
  updateCacheTabs: () => Promise<void>;
}

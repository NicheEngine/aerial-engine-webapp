import type { Store, StoreDefinition } from 'pinia';
import type { TabbarContext, TabbarStore } from 'tabbar-store';

import type { ComputedRef } from 'vue';
import type { Router, RouteRecordNormalized } from 'vue-router';

import type { TabDefinition } from '@engine-core/typings';

import { reactive, toRaw } from 'vue';

import { preferences } from '@engine-core/preferences';
import {
  openRouteInNewWindow,
  startProgress,
  stopProgress,
} from '@engine-core/shared/utils';

import { acceptHMRUpdate, defineStore } from 'pinia';

import store from '../index';
import {
  cloneTab,
  equalTab,
  getTabKey,
  getTabKeyFromTab,
  isAffixTab,
  isTabShown,
  routeToTab,
} from './helper';

const storeId: string = 'tabbar';

const storeOptions = (): TabbarStore => {
  const context: TabbarContext = reactive({
    cachedTabs: new Set(),
    dragEndIndex: 0,
    excludeCachedTabs: new Set(),
    menuList: [
      'close',
      'affix',
      'maximize',
      'reload',
      'open-in-new-window',
      'close-left',
      'close-right',
      'close-other',
      'close-all',
    ],
    renderRouteView: true,
    tabs: [],
    updateTime: Date.now(),
  });

  /**
   * Close tabs in bulk
   */
  async function _bulkCloseByKeys(keys: string[]) {
    const keySet = new Set(keys);
    context.tabs = context.tabs.filter(
      (item) => !keySet.has(getTabKeyFromTab(item)),
    );

    await updateCacheTabs();
  }

  /**
   * @zh_CN 关闭标签页
   * @param tab
   */
  function _close(tab: TabDefinition) {
    if (isAffixTab(tab)) {
      return;
    }
    const index = context.tabs.findIndex((item) => equalTab(item, tab));
    index !== -1 && context.tabs.splice(index, 1);
  }

  /**
   * @zh_CN 跳转到默认标签页
   */
  async function _goToDefaultTab(router: Router) {
    const tabs = getTabs();
    if (tabs.length <= 0) {
      return;
    }
    const firstTab = tabs[0];
    if (firstTab) {
      await _goToTab(firstTab, router);
    }
  }

  /**
   * @zh_CN 跳转到标签页
   * @param tab
   * @param router
   */
  async function _goToTab(tab: TabDefinition, router: Router) {
    const { params, path, query } = tab;
    const toParams = {
      params: params || {},
      path,
      query: query || {},
    };
    await router.replace(toParams);
  }

  /**
   * @zh_CN 添加标签页
   * @param routeTab
   */
  function addTab(routeTab: TabDefinition): TabDefinition {
    let tab = cloneTab(routeTab);
    if (!tab.key) {
      tab.key = getTabKey(routeTab);
    }
    if (!isTabShown(tab)) {
      return tab;
    }

    const tabIndex = context.tabs.findIndex((item) => {
      return equalTab(item, tab);
    });

    if (tabIndex === -1) {
      const maxCount = preferences.tabbar.maxCount;
      // 获取动态路由打开数，超过 0 即代表需要控制打开数
      const maxNumOfOpenTab = (routeTab?.meta?.maxNumOfOpenTab ?? -1) as number;
      // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
      // 获取到已经打开的动态路由数, 判断是否大于某一个值
      if (
        maxNumOfOpenTab > 0 &&
        context.tabs.filter((tab) => tab.name === routeTab.name).length >=
          maxNumOfOpenTab
      ) {
        // 关闭第一个
        const index = context.tabs.findIndex(
          (item) => item.name === routeTab.name,
        );
        index !== -1 && context.tabs.splice(index, 1);
      } else if (maxCount > 0 && context.tabs.length >= maxCount) {
        // 关闭第一个
        const index = context.tabs.findIndex(
          (item) => !Reflect.has(item.meta, 'affixTab') || !item.meta.affixTab,
        );
        index !== -1 && context.tabs.splice(index, 1);
      }
      context.tabs.push(tab);
    } else {
      // 页面已经存在，不重复添加选项卡，只更新选项卡参数
      const currentTab = toRaw(context.tabs)[tabIndex];
      const mergedTab = {
        ...currentTab,
        ...tab,
        meta: { ...currentTab?.meta, ...tab.meta },
      };
      if (currentTab) {
        const curMeta = currentTab.meta;
        if (Reflect.has(curMeta, 'affixTab')) {
          mergedTab.meta.affixTab = curMeta.affixTab;
        }
        if (Reflect.has(curMeta, 'newTabTitle')) {
          mergedTab.meta.newTabTitle = curMeta.newTabTitle;
        }
      }
      tab = mergedTab;
      context.tabs.splice(tabIndex, 1, mergedTab);
    }
    updateCacheTabs().then(() => {});
    return tab;
  }

  /**
   * @zh_CN 关闭所有标签页
   */
  async function closeAllTabs(router: Router) {
    const newTabs = context.tabs.filter((tab) => isAffixTab(tab));
    context.tabs =
      newTabs.length > 0 ? newTabs : [...context.tabs].splice(0, 1);
    await _goToDefaultTab(router);
    await updateCacheTabs();
  }

  /**
   * @zh_CN 关闭左侧标签页
   * @param tab
   */
  async function closeLeftTabs(tab: TabDefinition) {
    const index = context.tabs.findIndex((item) => equalTab(item, tab));

    if (index < 1) {
      return;
    }

    const leftTabs = context.tabs.slice(0, index);
    const keys: string[] = [];

    for (const item of leftTabs) {
      if (!isAffixTab(item)) {
        keys.push(item.key as string);
      }
    }
    await _bulkCloseByKeys(keys);
  }

  /**
   * @zh_CN 关闭其他标签页
   * @param tab
   */
  async function closeOtherTabs(tab: TabDefinition) {
    const closeKeys = context.tabs.map((item) => getTabKeyFromTab(item));

    const keys: string[] = [];

    for (const key of closeKeys) {
      if (key !== getTabKeyFromTab(tab)) {
        const closeTab = context.tabs.find(
          (item) => getTabKeyFromTab(item) === key,
        );
        if (!closeTab) {
          continue;
        }
        if (!isAffixTab(closeTab)) {
          keys.push(closeTab.key as string);
        }
      }
    }
    await _bulkCloseByKeys(keys);
  }

  /**
   * @zh_CN 关闭右侧标签页
   * @param tab
   */
  async function closeRightTabs(tab: TabDefinition) {
    const index = context.tabs.findIndex((item) => equalTab(item, tab));

    if (index !== -1 && index < context.tabs.length - 1) {
      const rightTabs = context.tabs.slice(index + 1);

      const keys: string[] = [];
      for (const item of rightTabs) {
        if (!isAffixTab(item)) {
          keys.push(item.key as string);
        }
      }
      await _bulkCloseByKeys(keys);
    }
  }

  /**
   * @zh_CN 关闭标签页
   * @param tab
   * @param router
   */
  async function closeTab(tab: TabDefinition, router: Router) {
    const { currentRoute } = router;
    // 关闭不是激活选项卡
    if (getTabKey(currentRoute.value) !== getTabKeyFromTab(tab)) {
      _close(tab);
      updateCacheTabs();
      return;
    }
    const tabs = getTabs();
    const index = tabs.findIndex(
      (item) => getTabKeyFromTab(item) === getTabKey(currentRoute.value),
    );

    const before = tabs[index - 1];
    const after = tabs[index + 1];

    // 下一个tab存在，跳转到下一个
    if (after) {
      _close(tab);
      await _goToTab(after, router);
      // 上一个tab存在，跳转到上一个
    } else if (before) {
      _close(tab);
      await _goToTab(before, router);
    } else {
      console.error('Failed to close the tab; only one tab remains open.');
    }
  }

  /**
   * @zh_CN 通过key关闭标签页
   * @param key
   * @param router
   */
  async function closeTabByKey(key: string, router: Router) {
    const originKey = decodeURIComponent(key);
    const index = context.tabs.findIndex(
      (item) => getTabKeyFromTab(item) === originKey,
    );
    if (index === -1) {
      return;
    }

    const tab = context.tabs[index];
    if (tab) {
      await closeTab(tab, router);
    }
  }

  /**
   * 根据tab的key获取tab
   * @param key
   */
  function getTabByKey(key: string) {
    return getTabs().find(
      (item) => getTabKeyFromTab(item) === key,
    ) as TabDefinition;
  }

  /**
   * @zh_CN 新窗口打开标签页
   * @param tab
   */
  async function openTabInNewWindow(tab: TabDefinition) {
    openRouteInNewWindow(tab.fullPath || tab.path);
  }

  /**
   * @zh_CN 固定标签页
   * @param tab
   */
  async function pinTab(tab: TabDefinition) {
    const index = context.tabs.findIndex((item) => equalTab(item, tab));
    if (index === -1) {
      return;
    }
    const oldTab = context.tabs[index];
    tab.meta.affixTab = true;
    tab.meta.title = oldTab?.meta?.title as string;
    // context.addTab(tab);
    context.tabs.splice(index, 1, tab);
    // 过滤固定tabs，后面更改affixTabOrder的值的话可能会有问题，目前行464排序affixTabs没有设置值
    const affixTabs = context.tabs.filter((tab) => isAffixTab(tab));
    // 获得固定tabs的index
    const newIndex = affixTabs.findIndex((item) => equalTab(item, tab));
    // 交换位置重新排序
    await sortTabs(index, newIndex);
  }

  /**
   * 刷新标签页
   */
  async function refresh(router: Router | string) {
    // 如果是Router路由，那么就根据当前路由刷新
    // 如果是string字符串，为路由名称，则定向刷新指定标签页，不能是当前路由名称，否则不会刷新
    if (typeof router === 'string') {
      return await refreshByName(router);
    }

    const { currentRoute } = router;
    const { name } = currentRoute.value;

    context.excludeCachedTabs.add(name as string);
    context.renderRouteView = false;
    await startProgress();

    await new Promise((resolve) => setTimeout(resolve, 200));

    context.excludeCachedTabs.delete(name as string);
    context.renderRouteView = true;
    await stopProgress();
  }

  /**
   * 根据路由名称刷新指定标签页
   */
  async function refreshByName(name: string) {
    context.excludeCachedTabs.add(name);
    await new Promise((resolve) => setTimeout(resolve, 200));
    context.excludeCachedTabs.delete(name);
  }

  /**
   * @zh_CN 重置标签页标题
   */
  async function resetTabTitle(tab: TabDefinition) {
    if (tab?.meta?.newTabTitle) {
      return;
    }
    const findTab = context.tabs.find((item) => equalTab(item, tab));
    if (findTab) {
      findTab.meta.newTabTitle = undefined;
      await updateCacheTabs();
    }
  }

  /**
   * 设置固定标签页
   * @param tabs
   */
  function setAffixTabs(tabs: RouteRecordNormalized[]) {
    for (const tab of tabs) {
      tab.meta.affixTab = true;
      addTab(routeToTab(tab));
    }
  }

  /**
   * @zh_CN 更新菜单列表
   * @param list
   */
  function setMenuList(list: string[]) {
    context.menuList = list;
  }

  /**
   * @zh_CN 设置标签页标题
   *
   * @zh_CN 支持设置静态标题字符串或计算属性作为动态标题
   * @zh_CN 当标题为计算属性时,标题会随计算属性值变化而自动更新
   * @zh_CN 适用于需要根据状态或多语言动态更新标题的场景
   *
   * @param {TabDefinition} tab - 标签页对象
   * @param {ComputedRef<string> | string} title - 标题内容,支持静态字符串或计算属性
   *
   * @example
   * // 设置静态标题
   * setTabTitle(tab, '新标签页');
   *
   * @example
   * // 设置动态标题
   * setTabTitle(tab, computed(() => t('common.dashboard')));
   */
  async function setTabTitle(
    tab: TabDefinition,
    title: ComputedRef<string> | string,
  ) {
    const findTab = context.tabs.find((item) => equalTab(item, tab));

    if (findTab) {
      findTab.meta.newTabTitle = title;

      await updateCacheTabs();
    }
  }

  function setUpdateTime() {
    context.updateTime = Date.now();
  }

  /**
   * @zh_CN 设置标签页顺序
   * @param oldIndex
   * @param newIndex
   */
  async function sortTabs(oldIndex: number, newIndex: number) {
    const currentTab = context.tabs[oldIndex];
    if (!currentTab) {
      return;
    }
    context.tabs.splice(oldIndex, 1);
    context.tabs.splice(newIndex, 0, currentTab);
    context.dragEndIndex = context.dragEndIndex + 1;
  }

  /**
   * @zh_CN 切换固定标签页
   * @param tab
   */
  async function toggleTabPin(tab: TabDefinition) {
    const affixTab = tab?.meta?.affixTab ?? false;

    await (affixTab ? unpinTab(tab) : pinTab(tab));
  }

  /**
   * @zh_CN 取消固定标签页
   * @param tab
   */
  async function unpinTab(tab: TabDefinition) {
    const index = context.tabs.findIndex((item) => equalTab(item, tab));
    if (index === -1) {
      return;
    }
    const oldTab = context.tabs[index];
    tab.meta.affixTab = false;
    tab.meta.title = oldTab?.meta?.title as string;
    // context.addTab(tab);
    context.tabs.splice(index, 1, tab);
    // 过滤固定tabs，后面更改affixTabOrder的值的话可能会有问题，目前行464排序affixTabs没有设置值
    const affixTabs = context.tabs.filter((tab) => isAffixTab(tab));
    // 获得固定tabs的index,使用固定tabs的下一个位置也就是活动tabs的第一个位置
    const newIndex = affixTabs.length;
    // 交换位置重新排序
    await sortTabs(index, newIndex);
  }

  /**
   * 根据当前打开的选项卡更新缓存
   */
  async function updateCacheTabs() {
    const cacheMap = new Set<string>();

    for (const tab of context.tabs) {
      // 跳过不需要持久化的标签页
      const keepAlive = tab.meta?.keepAlive;
      if (!keepAlive) {
        continue;
      }
      (tab.matched || []).forEach((t, i) => {
        if (i > 0) {
          cacheMap.add(t.name as string);
        }
      });

      const name = tab.name as string;
      cacheMap.add(name);
    }
    context.cachedTabs = cacheMap;
  }

  function affixTabs(): TabDefinition[] {
    const affixTabs = context.tabs.filter((tab) => isAffixTab(tab));

    return affixTabs.sort((a, b) => {
      const orderA = (a.meta?.affixTabOrder ?? 0) as number;
      const orderB = (b.meta?.affixTabOrder ?? 0) as number;
      return orderA - orderB;
    });
  }

  function getCachedTabs(): string[] {
    return [...context.cachedTabs];
  }

  function getExcludeCachedTabs(): string[] {
    return [...context.excludeCachedTabs];
  }

  function getMenuList(): string[] {
    return context.menuList;
  }

  function getTabs(): TabDefinition[] {
    const normalTabs = context.tabs.filter((tab) => !isAffixTab(tab));
    return [...affixTabs(), ...normalTabs].filter(Boolean);
  }

  function resetContext() {
    context.cachedTabs = new Set();
    context.dragEndIndex = 0;
    context.excludeCachedTabs = new Set();
    context.menuList = [
      'close',
      'affix',
      'maximize',
      'reload',
      'open-in-new-window',
      'close-left',
      'close-right',
      'close-other',
      'close-all',
    ];
    context.renderRouteView = true;
    context.tabs = [];
    context.updateTime = Date.now();
  }

  return {
    /* 持久化 */
    persist: [
      {
        pick: [context.tabs],
        storage: sessionStorage,
      },
    ],
    context,
    _bulkCloseByKeys,
    _close,
    _goToDefaultTab,
    _goToTab,
    addTab,
    affixTabs,
    closeAllTabs,
    closeLeftTabs,
    closeOtherTabs,
    closeRightTabs,
    closeTab,
    closeTabByKey,
    getCachedTabs,
    getExcludeCachedTabs,
    getMenuList,
    getTabByKey,
    getTabs,
    setUpdateTime,
    openTabInNewWindow,
    pinTab,
    refresh,
    refreshByName,
    resetTabTitle,
    setAffixTabs,
    setMenuList,
    setTabTitle,
    sortTabs,
    toggleTabPin,
    unpinTab,
    updateCacheTabs,
    resetContext,
  } as TabbarStore;
};

const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useTabbarStore, hot));
}

const tabbarStore: StoreDefinition<
  string,
  Pick<TabbarStore, never>,
  Pick<TabbarStore, never>,
  Pick<TabbarStore, keyof TabbarStore>
> = defineStore(storeId, storeOptions);

export function useTabbarStore(): Store<
  string,
  Pick<TabbarStore, never>,
  Pick<TabbarStore, never>,
  Pick<TabbarStore, keyof TabbarStore>
> {
  return tabbarStore(store);
}

export function newTabbarStore(): Store<
  string,
  Pick<TabbarStore, never>,
  Pick<TabbarStore, never>,
  Pick<TabbarStore, keyof TabbarStore>
> {
  return tabbarStore();
}

export * from './helper';

export default tabbarStore;

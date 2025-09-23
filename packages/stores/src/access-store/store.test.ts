import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { newAccessStore } from './index';

describe('newAccessStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates accessMenus state', () => {
    const store = newAccessStore();
    expect(store.context.accessMenus).toEqual([]);
    store.setAccessMenus([{ name: 'Dashboard', path: '/dashboard' }]);
    expect(store.context.accessMenus).toEqual([
      { name: 'Dashboard', path: '/dashboard' },
    ]);
  });

  it('updates accessToken state correctly', () => {
    const store = newAccessStore();
    expect(store.context.accessToken).toBeNull(); // 初始状态
    store.setAccessToken('abc123');
    expect(store.context.accessToken).toBe('abc123');
  });

  it('returns the correct accessToken', () => {
    const store = newAccessStore();
    store.setAccessToken('xyz789');
    expect(store.context.accessToken).toBe('xyz789');
  });

  // 测试设置空的访问菜单列表
  it('handles empty accessMenus correctly', () => {
    const store = newAccessStore();
    store.setAccessMenus([]);
    expect(store.context.accessMenus).toEqual([]);
  });

  // 测试设置空的访问路由列表
  it('handles empty accessRoutes correctly', () => {
    const store = newAccessStore();
    store.setAccessRoutes([]);
    expect(store.context.accessRoutes).toEqual([]);
  });
});

import type { UserConfig } from 'vite';

import type { ApplicationPluginOptions } from '@engine/vite-config';

import { defineConfig } from '@engine/vite-config';

import serverProxies from './proxies.json';

export default defineConfig(async () => {
  return {
    application: {
      serverProxies,
      depend: true,
      dependOptions: {
        build: true,
        serve: true,
        depends: {
          cesium: false,
          easyplayer: false,
          tianditu: false,
        },
      },
    } as ApplicationPluginOptions,
    vite: {
      test: {
        globals: true, // 全局引入vitest位置
        environment: 'jsdom', // 环境选择 jsdom
        includeSource: ['src/**/*.{js,ts}'],
      },
    } as UserConfig,
  };
});

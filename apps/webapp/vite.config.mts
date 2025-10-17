import { defineConfig } from '@engine/vite-config';

import serverProxies from './proxies.json';

export default defineConfig(async () => {
  return {
    application: {
      serverProxies,
    },
    vite: {
      test: {
        globals: true, // 全局引入vitest位置
        environment: 'jsdom', // 环境选择 jsdom
        includeSource: ['src/**/*.{js,ts}'],
      },
    },
  };
});

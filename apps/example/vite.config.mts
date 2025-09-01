import { defineConfig } from '@engine/vite-config';

import serverProxies from './proxies.json';

export default defineConfig(async () => {
  return {
    application: {
      serverProxies,
    },
    vite: {},
  };
});

import type { ServerProxies } from '@engine/vite-config';

export default {
  mock: {
    prefix: '/mock',
    target: 'http://localhost:5320',
  },
  api: {
    prefix: '/api',
    target: 'http://127.0.0.1:8080',
  },
  server: {
    prefix: '/server',
    target: 'http://127.0.0.1:8081',
  },
} as ServerProxies;

import type { ServerProxies } from '@engine/vite-config';

export default {
  api: {
    prefix: '/api',
    target: 'http://localhost:5320',
  },
  server: {
    prefix: '/server',
    target: 'http://127.0.0.1:8081',
  },
} as ServerProxies;

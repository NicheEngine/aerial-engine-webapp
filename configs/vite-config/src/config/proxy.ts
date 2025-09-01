import type { ProxyOptions } from 'vite';

import * as http from 'node:http';

import { colors } from '@engine/node-utils';

export interface ServerProxy extends ProxyOptions {
  prefix?: string;
  target: string;
}

export type ServerProxies = Record<string, ServerProxy>;

const httpsMatches = /^https:\/\//;

async function createProxy(serverProxies: ServerProxies) {
  const serverProxy: Record<string, ProxyOptions> = {};

  for (const [key, proxy] of Object.entries(serverProxies)) {
    if (!proxy || !key) {
      continue;
    }
    const target = proxy.target;
    const isHttps = httpsMatches.test(target);

    const prefix = proxy?.prefix ?? `/${key}`;

    const rewrite = (path: string) => {
      return path.replace(new RegExp(`^${prefix}`), '');
    };
    // https://github.com/http-party/node-http-proxy#options
    serverProxy[prefix] = {
      // exp: http://127.0.0.1:8080
      target,
      // 表示开启代理, 允许跨域请求数据
      changeOrigin: proxy?.changeOrigin ?? true,
      ws: proxy?.ws ?? true,
      agent: proxy?.agent ?? new http.Agent(),
      rewrite: proxy?.rewrite ?? rewrite,
      // 如果是https接口，需要配置这个参数
      ...(isHttps ? { secure: false } : {}),
    };
    console.log(
      `\n✨ ${colors.cyan(`[${key}]`)}: ` +
        `${colors.green(`[${target}]`)}` +
        ' - proxy config successfully!',
    );
  }
  return serverProxy;
}

export { createProxy };

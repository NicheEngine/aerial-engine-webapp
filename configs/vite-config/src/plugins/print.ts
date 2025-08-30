import type { PluginOption } from 'vite';

import type { PrintPluginOptions } from '../typing';

import { colors } from '@engine/node-utils';

export const vitePrintPlugin = (
  options: PrintPluginOptions = {},
): PluginOption => {
  const { infoMap = {} } = options;

  return {
    enforce: 'pre',
    name: 'vite:print-info-plugin',
    configureServer(server) {
      const _printUrls = server.printUrls;
      server.printUrls = () => {
        _printUrls();

        for (const [key, value] of Object.entries(infoMap)) {
          console.log(
            `  ${colors.green('➜')}  ${colors.bold(key)}: ${colors.cyan(value)}`,
          );
        }
      };
    },
  } as PluginOption;
};

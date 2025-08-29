import type { PluginOption } from 'vite';

import process from 'node:process';

import { colors, readPackageJSON } from '@engine/node-utils';

interface PluginOptions {
  depends: Record<string, () => void>;
  root: any;
}

/**
 * 用于将配置文件抽离出来并注入到项目中
 * @returns
 */

async function viteAppDependConfigPlugin({
  root = process.cwd(),
  depends,
}: PluginOptions): Promise<PluginOption | undefined> {
  const { name } = await readPackageJSON(root);
  return {
    name: 'vite:app-depend-config-plugin',
    enforce: 'post',
    buildEnd: (error: any) => {
      appScriptsHandle(depends);
      if (error) {
        console.log(colors.red(`\nvite build error: \n${error}`));
      } else {
        console.log(
          `\n✨ ${colors.cyan(`[${name}]`)}` + ' - build successfully!',
        );
      }
    },
  };
}

const appScriptsHandle = (scripts: Record<string, () => void>) => {
  if (scripts && Object.entries(scripts).length > 0) {
    for (const [key, value] of Object.entries(scripts)) {
      try {
        value();
        console.log(
          `\n✨ ${colors.cyan(`[${key}]`)}` + ' - script run successfully!',
        );
      } catch (scriptError) {
        console.log(
          `\n✨ ${colors.cyan(`[${key}]`)} ${colors.red(`\nscript run with error: \n'${scriptError}`)}`,
        );
      }
    }
  }
};

async function viteAppServerConfigPlugin(
  depends: Record<string, () => void>,
): Promise<PluginOption | undefined> {
  return {
    name: 'app-server-plugin',
    enforce: 'pre',
    configureServer() {
      appScriptsHandle(depends);
    },
  };
}

export { viteAppDependConfigPlugin, viteAppServerConfigPlugin };

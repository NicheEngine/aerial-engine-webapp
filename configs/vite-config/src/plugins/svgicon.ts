import type { PluginOption } from 'vite';
import type { ViteSvgIconsPlugin } from 'vite-plugin-svg-icons';

/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */
import path from 'node:path';
import process from 'node:process';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

interface PluginOptions {
  isBuild: boolean;
  root: string;
}

async function viteSvgIconsPlugin({
  isBuild,
  root = process.cwd(),
}: PluginOptions): Promise<PluginOption | undefined> {
  const iconPath = path.resolve(root, 'src/assets/icons');
  console.log('iconPath', iconPath);
  const svgIconsPluginOptions: ViteSvgIconsPlugin = {
    iconDirs: [iconPath],
    svgoOptions: isBuild,
    symbolId: 'icon-[dir]-[name]',
    inject: 'body-last',
    customDomId: '__svg__icons__dom__',
  };
  return createSvgIconsPlugin(svgIconsPluginOptions);
}

export { viteSvgIconsPlugin };

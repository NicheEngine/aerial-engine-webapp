import type {
  NormalizedOutputOptions,
  OutputBundle,
  OutputChunk,
} from 'rollup';
import type { PluginOption } from 'vite';

import { EOL } from 'node:os';
import process from 'node:process';

import { dateUtil, readPackageJSON } from '@engine/node-utils';

/**
 * 用于注入版权信息
 * @returns
 */

async function viteLicensePlugin(
  root = process.cwd(),
): Promise<PluginOption | undefined> {
  const {
    description = '',
    homepage = '',
    version = '',
  } = await readPackageJSON(root);

  return {
    apply: 'build',
    enforce: 'post',
    name: 'vite:license-plugin',
    generateBundle(_options: NormalizedOutputOptions, bundle: OutputBundle) {
      const date = dateUtil().format('YYYY-MM-DD ');
      const copyrightText = `/*!
  * Engine
  * Version: ${version}
  * Author: engine
  * Copyright (C) 2024 Engine
  * License: MIT License
  * Description: ${description}
  * Date Created: ${date}
  * Homepage: ${homepage}
  * Contact: nicheengine@outlook.com
*/
              `.trim();

      for (const [, fileContent] of Object.entries(bundle)) {
        if (fileContent.type === 'chunk' && fileContent.isEntry) {
          const chunkContent = fileContent as OutputChunk;
          // 插入版权信息
          const content = chunkContent.code;
          // 更新bundle
          (fileContent as OutputChunk).code =
            `${copyrightText}${EOL}${content}`;
        }
      }
    },
  } as PluginOption;
}

export { viteLicensePlugin };

/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */

import { createPagePlugin } from './page.ts'
import { createMinifyHtmlPlugin } from './minify.ts'
import consola from 'consola'
import type { HtmlPagePluginOptions } from 'html-page-plugin'
import type { Plugin } from 'vite'

consola.wrapConsole()

export function createHtmlPagePlugin(
  userOptions: HtmlPagePluginOptions = {} as HtmlPagePluginOptions,
): Plugin[] {
  return [createPagePlugin(userOptions), createMinifyHtmlPlugin(userOptions)]
}

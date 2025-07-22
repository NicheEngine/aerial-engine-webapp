import type { Plugin } from 'vite'
import type { Options as MinifyOptions } from 'html-minifier-terser'
import { minify as minifyHtml } from 'html-minifier-terser'
import { htmlFilter } from './utils.ts'
import type { HtmlPagePluginOptions } from 'html-page-plugin'

function getOptions(minify: boolean): MinifyOptions {
  return {
    collapseWhitespace: minify,
    keepClosingSlash: minify,
    removeComments: minify,
    removeRedundantAttributes: minify,
    removeScriptTypeAttributes: minify,
    removeStyleLinkTypeAttributes: minify,
    useShortDoctype: minify,
    minifyCSS: minify,
  }
}

export async function minifyPage(html: string, minify: boolean | MinifyOptions) {
  if (typeof minify === 'boolean' && !minify) {
    return html
  }

  let minifyOptions: boolean | MinifyOptions = minify

  if (typeof minify === 'boolean' && minify) {
    minifyOptions = getOptions(minify)
  }

  return await minifyHtml(html, minifyOptions as MinifyOptions)
}

export function createMinifyHtmlPlugin({ minify = true }: HtmlPagePluginOptions = {}): Plugin {
  return {
    name: 'vite:minify-html',
    // apply: 'build',
    enforce: 'post',
    async generateBundle(_, outBundle) {
      if (minify) {
        for (const bundle of Object.values(outBundle)) {
          if (
            bundle.type === 'asset' &&
            htmlFilter(bundle.fileName) &&
            typeof bundle.source === 'string'
          ) {
            bundle.source = await minifyPage(bundle.source, minify)
          }
        }
      }
    },
  } as Plugin
}

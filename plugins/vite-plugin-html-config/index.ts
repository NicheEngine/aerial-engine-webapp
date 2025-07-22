/**
 * https://github.com/ahwgs/vite-plugin-html-config/blob/master/src/index.ts
 */

import { wrapScriptContent } from '../wrapViteEnvs'
import type { HtmlTagDescriptor, IndexHtmlTransformContext, Plugin } from 'vite'
import type { HtmlConfigPluginOptions, HtmlConfigOptions } from 'html-config-plugin'

const transformHtmlHandler = async (html: string, options: HtmlConfigOptions) => {
  const {
    favicon,
    title,
    headScripts = [],
    metas = [],
    links = [],
    style,
    scripts = [],
    preHeadScripts = [],
  } = options

  let resultHtmlStr = html
  const htmlResult: HtmlTagDescriptor[] = []
  if (favicon) {
    htmlResult.push({
      tag: 'link',
      attrs: {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: favicon,
      },
      injectTo: 'head',
    })
  }
  if (metas.length) {
    metas.forEach((meta) => {
      htmlResult.push({
        tag: 'meta',
        injectTo: 'head',
        attrs: { ...meta },
      })
    })
  }
  if (links.length) {
    links.forEach((meta) => {
      htmlResult.push({
        tag: 'link',
        injectTo: 'head',
        attrs: { ...meta },
      })
    })
  }
  if (style && style.length) {
    htmlResult.push({
      tag: 'style',
      injectTo: 'head',
      children: `${style}`
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n'),
    })
  }
  if (title && title.length) {
    resultHtmlStr = html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
  }
  if (headScripts.length) {
    headScripts.forEach((script) => {
      htmlResult.push(wrapScriptContent(script, 'head'))
    })
  }
  if (scripts.length) {
    scripts.forEach((script) => {
      htmlResult.push(wrapScriptContent(script, 'body'))
    })
  }
  if (preHeadScripts.length) {
    preHeadScripts.forEach((script) => {
      htmlResult.push(wrapScriptContent(script, 'head-prepend'))
    })
  }
  return {
    html: resultHtmlStr,
    tags: htmlResult,
  }
}

const matchHtmlKey = (path: string) => {
  const lastIndex = path.lastIndexOf('/')
  const filename = path.substring(lastIndex + 1)
  return filename.substring(0, filename.lastIndexOf('.'))
}

export default function createHtmlConfigPlugin(htmlOptions: HtmlConfigPluginOptions): Plugin {
  const pagesOptions = htmlOptions.pages
  const indexOptions = htmlOptions.index
  let pluginOptions: Record<string, HtmlConfigOptions> = {} as Record<string, HtmlConfigOptions>
  if (pagesOptions) {
    pluginOptions = pagesOptions
  } else if (indexOptions) {
    pluginOptions = {
      index: indexOptions,
    }
  }
  if (Object.entries(pluginOptions).length === 0) {
    return {} as Plugin
  }

  return {
    name: 'html-config-plugin',
    enforce: 'pre',
    transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
      const htmlPath: string = ctx.path
      const htmlKey: string = matchHtmlKey(htmlPath)
      const options: HtmlConfigOptions = pluginOptions[htmlKey] || {}
      if (!options || Object.entries(pluginOptions).length === 0) {
        return
      }
      return transformHtmlHandler(html, options)
    },
  } as Plugin
}

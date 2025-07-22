import { render } from 'ejs'
import { isDirEmpty, loadEnv, resolveAliasPath, resolveSimple } from './utils.ts'
import type {
  IndexHtmlTransformContext,
  Plugin,
  ResolvedConfig,
  UserConfig,
  ViteDevServer,
} from 'vite'
import * as Vite from 'vite'
import { normalizePath } from 'vite'
import { parse } from 'node-html-parser'
import fs from 'fs-extra'
import path from 'pathe'
import fg from 'fast-glob'
import consola from 'consola'
import { dim } from 'colorette'
import type {
  HtmlPageConfig,
  HtmlPageOptions,
  HtmlPagePluginOptions,
  InjectOptions,
} from 'html-page-plugin'
import { historyFallback } from '../history-fallback'
import type { HistoryContext } from 'history-fallback'

const DEFAULT_KEY = 'index'
const DEFAULT_FILENAME = 'index.html'
const DEFAULT_TEMPLATE = 'index.html'

const ignoreDirs = ['.', '', '/']

const bodyInjectRE = /<\/body>/

function viteMajorVersion() {
  process.versions.node
  return Vite?.version ? Number(Vite.version.split('.')[0]) : 2
}

const matchHtmlKey = (path: string) => {
  const lastIndex = path.lastIndexOf('/')
  const filename = path.substring(lastIndex + 1)
  return filename.substring(0, filename.lastIndexOf('.'))
}

export function createPagePlugin(userOptions: HtmlPagePluginOptions = {} as HtmlPagePluginOptions) {
  const { pages = [], verbose = false } = userOptions
  let viteConfig: ResolvedConfig
  let viteEnv: Record<string, any> = {} as Record<string, any>
  const transformIndexHtmlHandler = async (html: string, ctx: IndexHtmlTransformContext) => {
    const htmlPath = ctx.path
    const htmlKey = matchHtmlKey(htmlPath)
    const htmlPage = wrapHtmlPage(userOptions, htmlKey, viteConfig)
    const { inject: injectOptions = {} } = htmlPage
    const _html = await renderHtml(html, {
      injectOptions,
      viteConfig,
      viteEnv,
      entry: htmlPage.entry,
      verbose,
    })
    const { tags = [] } = injectOptions
    return {
      html: _html,
      tags: tags,
    }
  }

  return {
    name: 'vite:html',
    enforce: 'pre',
    configResolved(resolvedConfig: ResolvedConfig) {
      viteConfig = resolvedConfig
      viteEnv = loadEnv(viteConfig.mode, viteConfig.root, '')
    },
    config(config: UserConfig) {
      const input = createInput(userOptions, config)
      if (input) {
        return {
          build: {
            rollupOptions: {
              input,
            },
          },
        }
      }
    },
    configureServer(server: ViteDevServer) {
      let _pages: HtmlPageOptions[] = []
      const rewrites: { from: RegExp; to: any }[] = []
      if (!isMpa(viteConfig)) {
        const key = userOptions.key || DEFAULT_KEY
        const template = userOptions?.template
          ? resolveSimple(viteConfig, userOptions.template)
          : DEFAULT_TEMPLATE
        const filename = userOptions?.filename || DEFAULT_FILENAME
        _pages.push({
          default: true,
          key,
          filename,
          template,
        })
      } else {
        _pages = pages.map((page) => {
          const resolveTemplate = resolveSimple(viteConfig, page.template)
          return {
            default: page?.default || false,
            key: page.key || DEFAULT_KEY,
            filename: page.filename || DEFAULT_FILENAME,
            template: resolveTemplate || DEFAULT_TEMPLATE,
          }
        })
      }

      const proxy = viteConfig.server?.proxy ?? {}
      const baseUrl = viteConfig.base ?? '/'
      const keys = Object.keys(proxy)

      let indexPage: HtmlPageOptions | undefined
      let defaultPage: HtmlPageOptions | undefined
      for (const page of _pages) {
        if (page.key === 'index' || page.filename === 'index.html') {
          indexPage = page
        }
        if (page.default) {
          defaultPage = page
        }
        rewrites.push(createRewire(page.key, page, baseUrl, keys))
      }
      if (!defaultPage) {
        defaultPage = indexPage
      }

      if (defaultPage) {
        rewrites.push(createRewire('', defaultPage, baseUrl, keys))
      }
      server.middlewares.use(
        historyFallback({
          disableDotRule: undefined,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
          rewrites: rewrites,
        }),
      )
    },
    transformIndexHtml:
      viteMajorVersion() >= 5
        ? {
            order: 'pre',
            handler: transformIndexHtmlHandler,
          }
        : {
            enforce: 'pre',
            transform: transformIndexHtmlHandler,
          },
    async closeBundle() {
      const outputDirs: string[] = []

      if (isMpa(viteConfig) || pages.length) {
        for (const page of pages) {
          const dir = path.dirname(page.template)
          if (!ignoreDirs.includes(dir)) {
            outputDirs.push(dir)
          }
        }
      } else {
        const dir = path.dirname(userOptions.template || DEFAULT_TEMPLATE)
        if (!ignoreDirs.includes(dir)) {
          outputDirs.push(dir)
        }
      }
      const cwd = path.resolve(viteConfig.root, viteConfig.build.outDir)
      const htmlFiles = await fg(
        outputDirs.map((dir) => `${dir}/*.html`),
        { cwd: path.resolve(cwd), absolute: true },
      )

      await Promise.all(
        htmlFiles.map((file) =>
          fs.move(file, path.resolve(cwd, path.basename(file)), {
            overwrite: true,
          }),
        ),
      )

      const htmlDirs = await fg(
        outputDirs.map((dir) => dir),
        { cwd: path.resolve(cwd), onlyDirectories: true, absolute: true },
      )
      await Promise.all(
        htmlDirs.map(async (item) => {
          const isEmpty = await isDirEmpty(item)
          if (isEmpty) {
            return fs.remove(item)
          }
        }),
      )
    },
  } as Plugin
}

export function createInput(
  { pages = [], key = DEFAULT_KEY, template = DEFAULT_TEMPLATE }: HtmlPagePluginOptions,
  viteConfig: UserConfig,
): undefined | object | { [p: string]: string } {
  const input: Record<string, string> = {}
  if (isMpa(viteConfig) || pages?.length) {
    const templates = pages.map((page) => {
      return {
        key: page.key,
        path: resolveAliasPath(viteConfig, page?.template),
      }
    })
    templates.forEach((template) => {
      input[template.key] = template.path
    })
    return input
  } else {
    const resolveTemplate = resolveAliasPath(viteConfig, template)
    const dir = path.dirname(resolveTemplate)
    if (ignoreDirs.includes(dir)) {
      return undefined
    } else {
      return {
        [key]: resolveTemplate,
      }
    }
  }
}

export async function renderHtml(html: string, config: HtmlPageConfig) {
  const { injectOptions, viteConfig, viteEnv, entry, verbose } = config
  const { data, ejs: ejsOptions } = injectOptions

  const ejsData: Record<string, any> = {
    ...(viteConfig?.env ?? {}),
    ...(viteConfig?.define ?? {}),
    ...(viteEnv || {}),
    ...data,
  }
  let result: string = await render(html, ejsData, ejsOptions)
  if (entry) {
    const resolveEntry = resolveSimple(viteConfig, entry)
    result = removeEntryScript(result, verbose)
    result = result.replace(
      bodyInjectRE,
      `<script type="module" src="${normalizePath(`${resolveEntry}`)}"></script>\n</body>`,
    )
  }
  return result
}

export function wrapHtmlPage(
  userOptions: HtmlPagePluginOptions,
  htmlKey: string,
  viteConfig: ResolvedConfig,
) {
  const {
    pages = [],
    key = DEFAULT_KEY,
    entry,
    filename = DEFAULT_FILENAME,
    template = DEFAULT_TEMPLATE,
    inject: injectOptions = {},
  } = userOptions

  let htmlPage: HtmlPageOptions
  if (isMpa(viteConfig) || pages?.length) {
    htmlPage = matchHtmlPage(htmlKey, pages)
  } else {
    htmlPage = createSinglePage(key, entry, filename, template, injectOptions)
  }
  return htmlPage
}

function isMpa(viteConfig: ResolvedConfig | UserConfig): boolean {
  const input = viteConfig?.build?.rollupOptions?.input ?? undefined
  return typeof input !== 'string' && Object.keys(input || {}).length > 1
}

export function removeEntryScript(html: string, verbose = false) {
  if (!html) {
    return html
  }

  const root = parse(html)
  const scriptNodes = root.querySelectorAll('script[type=module]') || []
  const removedNode: string[] = []
  scriptNodes.forEach((item) => {
    removedNode.push(item.toString())
    item.parentNode.removeChild(item)
  })
  verbose &&
    removedNode.length &&
    consola.warn(
      `vite-plugin-html: Since you have already configured entry, ${dim(
        removedNode.toString(),
      )} is deleted. You may also delete it from the index.html.
          `,
    )
  return root.toString()
}

export function createSinglePage(
  key: string,
  entry: string | undefined,
  filename: string,
  template: string,
  inject: InjectOptions = {} as InjectOptions,
) {
  return {
    key,
    entry,
    filename: filename,
    template: template,
    inject: inject,
  } as HtmlPageOptions
}

export function matchHtmlPage(htmlKey: string, pages: HtmlPageOptions[]): HtmlPageOptions {
  const defaultPageOption = {
    key: DEFAULT_KEY,
    filename: DEFAULT_FILENAME,
    template: `./${DEFAULT_TEMPLATE}`,
  } as HtmlPageOptions

  let htmlPage: HtmlPageOptions | undefined
  let defaultPage: HtmlPageOptions | undefined
  pages.forEach((page) => {
    if (!defaultPage && page?.default) {
      defaultPage = page
    }
    if (page.key === htmlKey) {
      htmlPage = page
    }
  })
  return htmlPage ?? defaultPage ?? defaultPageOption ?? undefined
}

function createRewire(key: string, page: HtmlPageOptions, baseUrl: string, proxyUrlKeys: string[]) {
  return {
    // ^/*   ^\/(#?)?\/?${key}(\/|\.html)?$   ^\/(#?)?\/?${key}(\/|\.html)?$
    from: new RegExp(!key || key === '' ? `^/*` : `^/${key}(/|.html|.html/)?$`),
    to: ({ parsedUrl }: HistoryContext) => {
      const pathname = parsedUrl?.pathname
      const excludeBaseUrl = pathname.replace(baseUrl, '/')
      const template = path.resolve(baseUrl, page.template)
      if (excludeBaseUrl.startsWith('/static')) {
        return excludeBaseUrl
      }
      if (excludeBaseUrl === '/') {
        return template
      }
      const isApiUrl = proxyUrlKeys.some((item) => pathname.startsWith(path.resolve(baseUrl, item)))
      return isApiUrl ? parsedUrl?.pathname : template
    },
  }
}

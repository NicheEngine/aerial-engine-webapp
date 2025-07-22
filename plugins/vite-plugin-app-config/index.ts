import createAppConfig from './config.ts'
import colors from 'picocolors'
import pkg from '../../package.json'
import { wrapScriptContent } from '../wrapViteEnvs'
import type { HtmlTagDescriptor, IndexHtmlTransformResult, Plugin } from 'vite'
import type { AppConfigPluginOptions } from 'app-config-plugin'

const appScriptsHandle = (scripts: Record<string, () => void>) => {
  if (scripts && Object.entries(scripts).length > 0) {
    for (const [key, value] of Object.entries(scripts)) {
      try {
        value()
        console.log(`\n✨ ${colors.cyan(`[${key}]`)}` + ' - script run successfully!\n')
      } catch (scriptError) {
        console.log(
          `\n✨ ${colors.cyan(`[${key}]`)} ${colors.red(`\nscript run with error: \n'${scriptError}`)}`,
        )
      }
    }
  }
}

export function createAppBuildStartPlugin(build: boolean = false): Plugin {
  return {
    name: 'app-build-start-plugin',
    enforce: 'pre',
    buildStart: () => {
      if (build) {
        createAppConfig()
      }
    },
  } as Plugin
}

export function createAppBuildEndPlugin(
  userOptions: AppConfigPluginOptions = {} as AppConfigPluginOptions,
): Plugin {
  const { build = false, ignored = false } = userOptions

  const scripts = userOptions.scripts

  return {
    name: 'app-build-end-plugin',
    enforce: 'post',
    buildEnd: (error) => {
      if (build) {
        appScriptsHandle(scripts)
        if (error && !ignored) {
          console.log(colors.red('\nvite build error: \n' + error))
        } else {
          console.log(`\n✨ ${colors.cyan(`[${pkg.name}]`)}` + ' - build successfully!')
        }
      } else {
        console.log(`\n✨ ${colors.cyan(`[${pkg.name}]`)}` + ' - restart successfully!')
      }
    },
  } as Plugin
}

export function createAppHtmlPlugin(
  userOptions: AppConfigPluginOptions = {} as AppConfigPluginOptions,
): Plugin {
  const { src, build } = userOptions

  const transformHtmlHandler = async (html: string) => {
    const script = {
      src: src,
      type: 'text/javascript',
      appConfig: 'true',
    }

    const resultHtmlStr = html
    const htmlResult: HtmlTagDescriptor[] = []
    if (build) {
      htmlResult.push(wrapScriptContent(script, 'head'))
    }
    return {
      html: resultHtmlStr,
      tags: htmlResult,
    } as IndexHtmlTransformResult
  }

  return {
    name: 'app-html-plugin',
    transformIndexHtml: {
      order: 'pre',
      handler: transformHtmlHandler,
    },
  } as Plugin
}

export function createAppServerPlugin(
  userOptions: AppConfigPluginOptions = {} as AppConfigPluginOptions,
): Plugin {
  const scripts = userOptions.scripts

  return {
    name: 'app-server-plugin',
    enforce: 'pre',
    configureServer() {
      appScriptsHandle(scripts)
    },
  } as Plugin
}

export function createAppConfigPlugin(
  userOptions: AppConfigPluginOptions = {} as AppConfigPluginOptions,
): Plugin[] {
  return [
    createAppBuildStartPlugin(userOptions?.build),
    createAppServerPlugin(userOptions),
    createAppHtmlPlugin(userOptions),
    createAppBuildEndPlugin(userOptions),
  ] as Plugin[]
}

import fs from 'fs-extra'
import path from 'path'
import dotenv from 'dotenv'
import APP_CONSTANTS from './constants.ts'
import type { HtmlTagDescriptor } from 'vite'
import type { ViteEnv } from 'vite:env'

export function isReportMode() {
  return process.env.REPORT === 'true'
}

export function wrapViteEnv(viteConfig: Record<string, string>): ViteEnv {
  const viteEnv: any = {}
  for (const [key, value] of Object.entries(viteConfig)) {
    process.env[key] = value
    const envValue: string = viteConfig[key].replace(/\\n/g, '\n')
    if (key === APP_CONSTANTS.APP_SERVER_PORT) {
      viteEnv[key] = Number(envValue)
    } else if (envValue === 'true' || envValue === 'false') {
      viteEnv[key] = envValue !== 'false'
    } else {
      viteEnv[key] = envValue
    }
  }
  return viteEnv
}

function wrapConfigFiles() {
  const script: string = process.env.npm_lifecycle_script ?? ''
  const regExp: RegExp = new RegExp('--mode ([a-z_\\d]+)')
  const result = regExp.exec(script)
  if (result) {
    const mode = result[1]
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.prod']
}

export function wrapEnvConfig(match: string = 'VITE_', confFiles: string[] = wrapConfigFiles()) {
  let viteEnv: ViteEnv = {} as ViteEnv
  confFiles.forEach((item) => {
    try {
      const dotEnv = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)))
      viteEnv = { ...viteEnv, ...dotEnv }
    } catch (error) {
      console.error(`Error in parsing ${item}`, error)
    }
  })
  const regExp = new RegExp(`^(${match})`)
  Object.keys(viteEnv).forEach((key) => {
    if (!regExp.test(key)) {
      Reflect.deleteProperty(viteEnv, key)
    }
  })
  return viteEnv
}

export function wrapScriptContent(
  script: any,
  injectTo: string & ('head' | 'body' | 'head-prepend' | 'body-prepend'),
) {
  let result: HtmlTagDescriptor
  if (typeof script === 'object' && script?.src) {
    result = {
      tag: 'script',
      injectTo,
      attrs: { ...script },
    }
  } else if (typeof script === 'object' && script?.content) {
    const { content, ...attr } = script
    result = {
      tag: 'script',
      injectTo,
      attrs: { ...attr },
      children: `${content}`,
    }
  } else {
    result = {
      tag: 'script',
      injectTo,
      children: `${script}`,
    }
  }
  return result
}

export function wrapRootPath(...dirs: string[]) {
  return path.resolve(process.cwd(), ...dirs)
}

export const wrapConfigName = (viteEnv: ViteEnv) => {
  return `__PRODUCTION__${viteEnv?.VITE_APP_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '')
}

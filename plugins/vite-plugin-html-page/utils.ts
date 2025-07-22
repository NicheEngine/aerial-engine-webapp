import { expand } from 'dotenv-expand'
import dotenv from 'dotenv'
import { join, dirname } from 'pathe'
import fs from 'fs-extra'
import { normalizePath } from 'vite'
import type { Alias, AliasOptions, ResolvedConfig, UserConfig } from 'vite'
import { createFilter } from '@rollup/pluginutils'

export const htmlFilter = createFilter(['**/*.html'])

export function loadEnv(mode: string, envDir: string, prefix: string = ''): Record<string, string> {
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
        `the .local postfix for .env files.`,
    )
  }

  const viteEnv: Record<string, string> = {}
  const envFiles = [
    /** mode local file */
    `.env.${mode}.local`,
    /** mode file */
    `.env.${mode}`,
    /** local file */
    `.env.local`,
    /** default file */
    `.env`,
  ]

  for (const file of envFiles) {
    const path = lookupFile(envDir, [file], true)
    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path))
      // let environment variables use each other
      expand({
        parsed,
        // prevent process.env mutation
        // ignoreProcessEnv: true,
      })

      // only keys that start with prefix are exposed to client
      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(prefix) && viteEnv[key] === undefined) {
          viteEnv[key] = value
        } else if (key === 'NODE_ENV') {
          // NODE_ENV override in .env file
          process.env.VITE_USER_NODE_ENV = value
        }
      }
    }
  }
  return viteEnv
}

export function lookupFile(
  dir: string,
  formats: string[],
  pathOnly: boolean = false,
): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if (fs.pathExistsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = dirname(dir)
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly)
  }
}

export async function isDirEmpty(dir: string) {
  return fs.readdirSync(dir).length === 0
}

export const resolveSimple = (viteConfig: ResolvedConfig, resolvePath: string) => {
  const resolveResult = resolveAliasPath(viteConfig, resolvePath)
  return simplePath(viteConfig, resolveResult)
}

export const simplePath = (viteConfig: ResolvedConfig, simplePath: string) => {
  let viteRoot: string = ''
  if (viteConfig?.root) {
    viteRoot = normalizePath(viteConfig?.root)
  }
  if (viteRoot && simplePath.includes(viteRoot)) {
    return simplePath.replace(viteRoot, '')
  } else {
    return simplePath
  }
}

export const resolveAliasPath = (viteConfig: ResolvedConfig | UserConfig, resolvePath: string) => {
  if (!resolvePath) return resolvePath
  const resolveAlias: { [find: string]: string } | AliasOptions = viteConfig?.resolve?.alias ?? []
  if (!resolveAlias) return resolvePath
  let viteRoot: string = ''
  if (viteConfig?.root) {
    viteRoot = normalizePath(viteConfig?.root)
  }
  let resolveResult: string = ''
  if (resolveAlias instanceof Array) {
    for (const alias of resolveAlias) {
      const aliasValue: Alias = alias
      const find = aliasValue?.find
      const replacement = aliasValue?.replacement
      if (find && replacement) {
        const match = resolvePath.match(find)
        if (match) {
          resolveResult = resolvePath.replace(find, replacement)
          break
        }
      }
    }
  } else {
    for (const [find, replacement] of Object.entries(resolveAlias)) {
      if (find && replacement) {
        const match = resolvePath.match(find)
        if (match) {
          resolveResult = resolvePath.replace(find, replacement)
          break
        }
      }
    }
  }
  if (resolveResult) {
    return normalizePath(resolveResult)
  } else {
    return join(viteRoot, resolvePath)
  }
}

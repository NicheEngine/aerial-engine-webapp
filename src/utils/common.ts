import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import { unref } from 'vue'
import type { App, Plugin } from 'vue'
import { isObject } from '@uts/staple.ts'
import type { Component, DefineComponent } from '@vue/runtime-core'

/* Set ui mount node */
export function popupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

/**
 * Add the object as a parameter to the URL
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  urlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function urlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

/* 深度合并 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

/* dynamic use hook props */
export function dynamicProps<T extends object, U>(props: T): Partial<U> {
  const result: Recordable = {}

  Object.keys(props).map((key) => {
    result[key] = unref((props as Recordable)[key])
  })

  return result as Partial<U>
}

export function rawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  }
}

export const withInstall = <T extends Component | DefineComponent>(
  component: T,
  alias?: string,
) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

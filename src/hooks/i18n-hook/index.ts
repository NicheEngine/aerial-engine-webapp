import { i18n } from 'app-locales'
import type { I18nParameters, I18nTranslation } from 'i18n-hook'
import type { Composer } from 'vue-i18n'

function keyOfNamespace(namespace: string | undefined, key: string) {
  if (!namespace) {
    return key
  }
  if (key.startsWith(namespace)) {
    return key
  }
  return `${namespace}.${key}`
}

export function useI18nHook(namespace?: string): { t: I18nTranslation } {
  const normalFunction = {
    t: (key: string) => {
      return keyOfNamespace(namespace, key)
    },
  }

  if (!i18n) {
    return normalFunction
  }

  const { t, ...methods } = i18n.global as Composer

  const applyOfI18n: I18nTranslation = (key: string, ...arg: any[]) => {
    if (!key) return ''
    if (!key.includes('.') && !namespace) return key
    return t(keyOfNamespace(namespace, key), ...(arg as I18nParameters))
  }
  return {
    ...methods,
    t: applyOfI18n,
  }
}

// Why write this function？
// Mainly to configure the vscode i18nn ally plugin. This function is only used for routing and menus. Please use useI18n for other places

// 为什么要编写此函数？
// 主要用于配合vscode i18nn ally插件。此功能仅用于路由和菜单。请在其他地方使用useI18n
export const t = (key: string) => key

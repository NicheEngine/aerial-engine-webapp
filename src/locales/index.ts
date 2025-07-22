import type { App } from 'vue'
import type { I18n, I18nOptions } from 'vue-i18n'
import { createI18n } from 'vue-i18n'

import { LocalePool } from 'app-locales'
import type { LocaleType } from 'app-locales'
import { LOCALE_SETTING } from 'app-settings'
import { useLocaleStore } from 'locale-store'
import { I18nObject } from '@lcs/I18nObject.ts'
import { set } from 'lodash-es'

const { fallback, availableLocales } = LOCALE_SETTING

export function message(langLocales: Record<string, Record<string, any>>, prefix = 'lang') {
  const locale: Recordable = {}

  Object.keys(langLocales).forEach((key) => {
    const langLocale = langLocales[key].default
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
    const lastIndex = fileName.lastIndexOf('.')
    fileName = fileName.substring(0, lastIndex)
    const keyList = fileName.split('/')
    const moduleName = keyList.shift()
    const localeKey = keyList.join('.')

    if (moduleName) {
      if (localeKey) {
        set(locale, moduleName, locale[moduleName] || {})
        set(locale[moduleName], localeKey, langLocale)
      } else {
        set(locale, moduleName, langLocale || {})
      }
    }
  })
  return locale
}

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStore()
  const locale: LocaleType = localeStore.getLocaleType()
  const defaultLocal = await import(`./lang/${locale}.ts`)
  const message = defaultLocal.default?.message ?? {}

  LocalePool.htmlLang(locale)
  LocalePool.callback((localePool: LocaleType[]) => {
    localePool.push(locale)
  })

  return {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      [locale]: message,
    },
    availableLocales: availableLocales,
    // If you don’t want to inherit locale from global scope,
    // you need to set sync of i18n component option to false.
    sync: true,
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  }
}

export async function setupI18n(app: App<Element>): Promise<void> {
  const options = await createI18nOptions()
  const i18n = createI18n(options) as I18n<any, any, any, string>
  I18nObject.default(i18n)
  app.use(i18n)
}

export default I18nObject.default().i18n

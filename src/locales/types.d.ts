declare module 'app-locales' {
  export { I18nObject } from './I18nObject.ts'
  export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko'

  export { LocalePool } from './LocalePool'

  export { default as i18n } from './index.ts'

  export interface LocaleSetting {
    showPicker: boolean
    // Current language
    locale: LocaleType
    // default language
    fallback: LocaleType
    // available Locales
    availableLocales: LocaleType[]
  }

  export { createI18nOptions, setupI18n, message } from './index.ts'
}

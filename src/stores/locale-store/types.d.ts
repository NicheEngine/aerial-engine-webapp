declare module 'locale-store' {
  import type { LocaleSetting, LocaleType } from '@tps/settings'
  import type { DefineStoreOptionsBase } from 'pinia'

  export interface LocaleContext {
    localInfo: LocaleSetting
  }

  export interface LocaleStore extends DefineStoreOptionsBase {
    context: LocaleContext
    getShowPicker: () => boolean
    getLocaleType: () => LocaleType
    setLocaleInfo: (localInfo: Partial<LocaleSetting>) => void
    setupLocaleSetting: () => void
  }

  export { localeStore, useLocaleStore } from './index.ts'
}

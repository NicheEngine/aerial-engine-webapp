import { defineStore } from 'pinia'
import store from '@/stores'
import type { StoreDefinition, Store } from 'pinia'
import type { LocaleType } from 'app-locales'
import type { LocaleSetting } from 'app-settings'

import { LOCALE_KEY } from '@ems/cacheTypes'
import { createLocalStorage } from 'storage-extend'
import { LOCALE_SETTING } from 'app-settings'
import type { LocaleContext, LocaleStore } from 'locale-store'
import { reactive } from 'vue'

const localStorage = createLocalStorage()

const localStorageLocaleSetting = (localStorage.get(LOCALE_KEY) || LOCALE_SETTING) as LocaleSetting

const storeId: string = 'locale'

const storeOptions = (): LocaleStore => {
  const context: LocaleContext = reactive({
    localInfo: localStorageLocaleSetting,
  })

  function getShowPicker(): boolean {
    return !!context.localInfo?.showPicker
  }

  function getLocaleType(): LocaleType {
    return context.localInfo?.locale ?? 'zh_CN'
  }

  /**
   * Set up multilingual information and cache
   * @param localInfo multilingual info
   */
  function setLocaleInfo(localInfo: Partial<LocaleSetting>): void {
    context.localInfo = { ...context.localInfo, ...localInfo }
    localStorage.set(LOCALE_KEY, context.localInfo)
  }
  /**
   * Initialize multilingual information and load the
   * existing configuration from the local cache
   */
  function setupLocaleSetting(): void {
    setLocaleInfo({
      ...LOCALE_SETTING,
      ...context.localInfo,
    })
  }
  return {
    /* 持久化 */
    persist: true,
    context,
    getShowPicker,
    getLocaleType,
    setLocaleInfo,
    setupLocaleSetting,
  } as LocaleStore
}

const localeStore: StoreDefinition<
  string,
  Pick<LocaleStore, never>,
  Pick<LocaleStore, never>,
  Pick<LocaleStore, keyof LocaleStore>
> = defineStore(storeId, storeOptions)

export function useLocaleStore(): Store<
  string,
  Pick<LocaleStore, never>,
  Pick<LocaleStore, never>,
  Pick<LocaleStore, keyof LocaleStore>
> {
  return localeStore(store)
}

export default localeStore

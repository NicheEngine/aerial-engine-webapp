/* Multi-language related operations */
import type { LocaleType } from 'app-locales'

import { i18n } from 'app-locales'
import { useLocaleStore } from 'locale-store'
import { unref, computed } from 'vue'
import { LocalePool } from 'app-locales'
import type { LangModule } from 'locale-hook'

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStore()

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    ;(i18n.global.locale as any).value = locale
  }
  localeStore.setLocaleInfo({ locale })
  LocalePool.htmlLang(locale)
}

export function useLocaleHook() {
  const localeStore = useLocaleStore()
  const localeType = computed(() => localeStore.getLocaleType)
  const showLocalePicker = computed(() => localeStore.getShowPicker)

  const antdLocale = computed((): any => {
    return i18n.global.getLocaleMessage(unref(localeType))?.antdLocale ?? {}
  })

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global
    const currentLocale = unref(globalI18n.locale)
    if (currentLocale === locale) {
      return locale
    }

    if (LocalePool.includes(locale)) {
      setI18nLanguage(locale)
      return locale
    }
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule
    if (!langModule) return
    const { message } = langModule
    globalI18n.setLocaleMessage(locale, message)
    LocalePool.push(locale)
    setI18nLanguage(locale)
    return locale
  }

  return {
    localeType,
    showLocalePicker,
    changeLocale,
    antdLocale,
  }
}

export default useLocaleHook

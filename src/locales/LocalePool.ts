import type { LocaleType } from 'app-locales'

export class LocalePool {
  private static instance: LocalePool
  private static LOCALE_CACHE: LocaleType[] = [] as LocaleType[]

  private constructor() {
    LocalePool.LOCALE_CACHE = [] as LocaleType[]
  }

  static default(): LocalePool {
    if (LocalePool.instance) {
      return LocalePool.instance
    } else {
      LocalePool.instance = new LocalePool()
      return LocalePool.instance
    }
  }

  static push(locale: LocaleType) {
    LocalePool.LOCALE_CACHE.push(locale)
  }

  static includes(locale: LocaleType): boolean {
    return LocalePool.LOCALE_CACHE.includes(locale)
  }

  static htmlLang(locale: LocaleType) {
    document.querySelector('html')?.setAttribute('lang', locale)
  }

  static callback(callback: (loadLocalePool: LocaleType[]) => void) {
    callback(LocalePool.LOCALE_CACHE)
  }
}

export default LocalePool

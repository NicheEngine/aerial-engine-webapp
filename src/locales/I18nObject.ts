import type { I18n } from 'vue-i18n'

export class I18nObject {
  private static instance: I18nObject
  i18n: I18n<any, any, any, string>

  constructor(i18n: I18n<any, any, any, string>) {
    this.i18n = i18n
  }

  static default(i18n: I18n = {} as I18n<any, any, any, string>): I18nObject {
    if (I18nObject.instance) {
      return I18nObject.instance
    } else {
      I18nObject.instance = new I18nObject(i18n)
      return I18nObject.instance
    }
  }
}

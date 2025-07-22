declare module 'i18n-hook' {
  export type I18nTranslation = {
    (key: string): string
    (key: string, locale: string): string
    (key: string, locale: string, list: unknown[]): string
    (key: string, locale: string, named: Record<string, unknown>): string
    (key: string, list: unknown[]): string
    (key: string, named: Record<string, unknown>): string
  }

  export type I18nParameters = [string, any]

  export { useI18nHook, t } from './index.ts'
}

declare module 'locale-hook' {
  export interface LangModule {
    message: Recordable
    locale: Recordable
    localeName: string
  }
  export { useLocaleHook } from './index.ts'
}

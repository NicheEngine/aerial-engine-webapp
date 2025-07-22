declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const Component: DefineComponent<object, object, any>
  export default Component
}

declare module 'ant-design-vue/locale/*' {
  import { Locale } from 'ant-design-vue/locale'
  const locale: Locale & ReadonlyRecordable
  export default locale as Locale & ReadonlyRecordable
}

declare module 'virtual:*' {
  const result: any
  export default result
}

declare module 'vite:env' {
  export type ViteEnv = ViteEnvMeta
}

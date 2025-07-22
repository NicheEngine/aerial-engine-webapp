// from element-plus

export {}

declare global {
  import type { CSSProperties, Plugin } from 'vue'

  export type OptionalKeys<T extends Record<string, unknown>> = {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
  }[keyof T]

  export type RequiredKeys<T extends Record<string, unknown>> = Exclude<keyof T, OptionalKeys<T>>

  export type MonoArgEmitter<T, Keys extends keyof T> = <K extends Keys>(evt: K, arg?: T[K]) => void

  export type BiArgEmitter<T, Keys extends keyof T> = <K extends Keys>(evt: K, arg: T[K]) => void

  export type EventEmitter<T extends Record<string, unknown>> = MonoArgEmitter<T, OptionalKeys<T>> &
    BiArgEmitter<T, RequiredKeys<T>>

  export type AnyFunction<T> = (...args: any[]) => T

  export type PartialReturnType<T extends (...args: unknown[]) => unknown> = Partial<ReturnType<T>>

  export type SFCWithInstall<T> = T & Plugin

  export type RefElement = Nullable<HTMLElement>

  export type CustomizedHTMLElement<T> = HTMLElement & T

  export type Indexable<T> = {
    [key: string]: T
  }

  export type Hash<T> = Indexable<T>

  export type TimeoutHandle = ReturnType<typeof global.setTimeout>

  export type ComponentSize = 'large' | 'medium' | 'small' | 'mini'

  export type StyleValue = string | CSSProperties | Array<StyleValue>

  export type Mutable<T> = { -readonly [P in keyof T]: T[P] }
}

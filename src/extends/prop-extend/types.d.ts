declare module 'prop-extend' {
  import type { ExtractPropTypes, PropType } from 'vue'
  import { PROP_KEY, WRAPPER_KEY } from './index'
  import type { CSSProperties, VNodeChild } from 'vue'
  import type { VueTypesInterface, VueTypeValidableDef } from 'vue-types'

  export type VueNode = VNodeChild | JSX.Element

  export type PropsTypes = VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
    readonly VNodeChild: VueTypeValidableDef<VueNode>
    // readonly trueBool: VueTypeValidableDef<boolean>;
  }

  export type ResolveProp<T> = ExtractPropTypes<{
    key: { type: T; required: true }
  }>['key']
  export type ResolvePropType<T> = ResolveProp<T> extends { type: infer V } ? V : ResolveProp<T>
  export type ResolvePropTypeWithReadonly<T> =
    Readonly<T> extends Readonly<Array<infer A>> ? ResolvePropType<A[]> : ResolvePropType<T>

  export type IfUnknown<T, V> = [unknown] extends [T] ? V : T

  export type NativePropType = [
    ((...args: any) => any) | { new (...args: any): any } | undefined | null,
  ]

  export type WrapperPropType<T> = {
    [WRAPPER_KEY]: T
  }

  export type BuildPropOption<T, D extends BuildPropType<T, V, C>, R, V, C> = {
    type?: WrapperPropType<T> | T
    values?: readonly V[]
    required?: R
    default?: R extends true
      ? never
      : D extends Record<string, unknown> | Array<any>
        ? () => D
        : (() => D) | D
    validator?: ((val: any) => val is C) | ((val: any) => boolean)
    [PROP_KEY]?: any
  }

  export type _BuildPropType<T, V, C> =
    | (T extends WrapperPropType<unknown>
        ? T[typeof WRAPPER_KEY]
        : [V] extends [never]
          ? ResolvePropTypeWithReadonly<T>
          : never)
    | V
    | C
  export type BuildPropType<T, V, C> = _BuildPropType<
    IfUnknown<T, never>,
    IfUnknown<V, never>,
    IfUnknown<C, never>
  >

  export type _BuildPropDefault<T, D> = [T] extends [
    Record<string, unknown> | Array<any> | Function,
  ]
    ? D
    : D extends () => T
      ? ReturnType<D>
      : D

  export type BuildPropDefault<T, D, R> = R extends true
    ? { readonly default?: undefined }
    : {
        readonly default: Exclude<D, undefined> extends never
          ? undefined
          : Exclude<_BuildPropDefault<T, D>, undefined>
      }
  export type BuildPropReturn<T, D, R, V, C> = {
    readonly type: PropType<BuildPropType<T, V, C>>
    readonly required: IfUnknown<R, false>
    readonly validator: ((val: unknown) => boolean) | undefined
    [PROP_KEY]: true
  } & BuildPropDefault<BuildPropType<T, V, C>, IfUnknown<D, never>, IfUnknown<R, false>>

  export {
    PROP_KEY,
    WRAPPER_KEY,
    PROPS_TYPES,
    isValidKey,
    buildProp,
    buildProps,
    definePropType,
    keysOf,
    mutable,
    COMPONENT_SIZE,
  } from './index'
}

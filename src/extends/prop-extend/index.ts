// copy from element-plus

import { warn } from 'vue'
import { isObject } from '@vue/shared'
import { fromPairs } from 'lodash-es'
import type {
  BuildPropType,
  NativePropType,
  BuildPropOption,
  BuildPropReturn,
  WrapperPropType,
  PropsTypes,
} from 'prop-extend'
import { createTypes } from 'vue-types'

export const WRAPPER_KEY: unique symbol = Symbol()
export const PROP_KEY: unique symbol = Symbol()

export function isValidKey(
  key: string | number | symbol,
  object: object,
): key is keyof typeof object {
  return key in object
}

/**
 * @description Build prop. It can better optimize prop types
 * @description 生成 prop，能更好地优化类型
 * @example
 // limited options
 // the type will be PropType<'light' | 'dark'>
 buildProp({
 type: String,
 values: ['light', 'dark'],
 } as const)
 * @example
 // limited options and other types
 // the type will be PropType<'small' | 'medium' | number>
 buildProp({
 type: [String, Number],
 values: ['small', 'medium'],
 validator: (val: unknown): val is number => typeof val === 'number',
 } as const)
 @link see more: https://github.com/element-plus/element-plus/pull/3341
 */
export function buildProp<
  T = never,
  D extends BuildPropType<T, V, C> = never,
  R extends boolean = false,
  V = never,
  C = never,
>(option: BuildPropOption<T, D, R, V, C>, key?: string): BuildPropReturn<T, D, R, V, C> {
  // filter native prop type and nested prop, e.g `null`, `undefined` (from `buildProps`)
  if (!isObject(option) || (isValidKey(PROP_KEY, option) && !!option[PROP_KEY]))
    return option as any

  const { values, required, default: defaultValue, type, validator } = option

  const _validator =
    values || validator
      ? (val: unknown) => {
          let valid = false
          let allowedValues: unknown[] = []

          if (values) {
            allowedValues = [...values, defaultValue]
            valid ||= allowedValues.includes(val)
          }
          if (validator) valid ||= validator(val)

          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)]
              .map((value) => JSON.stringify(value))
              .join(', ')
            warn(
              `Invalid prop: validation failed${
                key ? ` for prop "${key}"` : ''
              }. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`,
            )
          }
          return valid
        }
      : undefined

  return {
    type:
      typeof type === 'object' && Object.getOwnPropertySymbols(type).includes(WRAPPER_KEY)
        ? type && isValidKey(WRAPPER_KEY, type)
          ? type[WRAPPER_KEY]
          : type
        : type,
    required: !!required,
    default: defaultValue,
    validator: _validator,
    [PROP_KEY]: true,
  } as unknown as BuildPropReturn<T, D, R, V, C>
}

export const buildProps = <
  O extends {
    [K in keyof O]: O[K] extends BuildPropReturn<any, any, any, any, any>
      ? O[K]
      : [O[K]] extends NativePropType
        ? O[K]
        : O[K] extends BuildPropOption<infer T, infer D, infer R, infer V, infer C>
          ? D extends BuildPropType<T, V, C>
            ? BuildPropOption<T, D, R, V, C>
            : never
          : never
  },
>(
  props: O,
) =>
  fromPairs(
    Object.entries(props).map(([key, option]) => [key, buildProp(option as any, key)]),
  ) as unknown as {
    [K in keyof O]: O[K] extends { [PROP_KEY]: boolean }
      ? O[K]
      : [O[K]] extends NativePropType
        ? O[K]
        : O[K] extends BuildPropOption<infer T, infer _D, infer R, infer V, infer C>
          ? BuildPropReturn<T, O[K]['default'], R, V, C>
          : never
  }

export const definePropType = <T>(value: T) => ({ [WRAPPER_KEY]: value }) as WrapperPropType<T>

export const keysOf = <T extends object>(value: T) => Object.keys(value) as Array<keyof T>

export const mutable = <T extends readonly any[] | Record<string, unknown>>(value: T) =>
  value as Mutable<typeof value>

export const COMPONENT_SIZE = ['large', 'medium', 'small', 'mini'] as const

const PROPS_TYPES = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined,
}) as PropsTypes

PROPS_TYPES.extend([
  {
    name: 'style',
    getter: true,
    type: [String, Object],
    default: undefined,
  },
  {
    name: 'VNodeChild',
    getter: true,
    type: undefined,
  },
])
export { PROPS_TYPES }

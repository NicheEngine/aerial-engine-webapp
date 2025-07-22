import * as Lodash from 'lodash-es'

const toString = Object.prototype.toString

export function isType(value: unknown, type: string) {
  return toString.call(value) === `[object ${type}]`
}

export function isDefined<T = unknown>(value?: T): value is T {
  return typeof value !== 'undefined'
}

export function isUndefined<T = unknown>(value?: T): value is T {
  return !isDefined(value)
}

export function isObject(value: any): value is Record<any, any> {
  return value !== null && isType(value, 'Object')
}

export function isDate(value: unknown): value is Date {
  return isType(value, 'Date')
}

export function isNumber(value: unknown): value is number {
  return isType(value, 'Number')
}

export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    isType(value, 'Promise') && isObject(value) && isFunction(value.then) && isFunction(value.catch)
  )
}

export function isString(value: unknown): value is string {
  return isType(value, 'String')
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

export function isBoolean(value: unknown): value is boolean {
  return isType(value, 'Boolean')
}

export function isRegExp(value: unknown): value is RegExp {
  return isType(value, 'RegExp')
}

export function isArray(value: any): value is Array<any> {
  return value && Array.isArray(value)
}

export function isWindow(value: any): value is Window {
  return typeof window !== 'undefined' && isType(value, 'Window')
}

export function isElement(value: unknown): value is Element {
  return isObject(value) && !!value.tagName
}

export function isMap(value: unknown): value is Map<any, any> {
  return isType(value, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(value: string): boolean {
  const regExp: RegExp =
    /^(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-_]*)?(\/#\/)?(?:\/[+~%\/.\w-_]*)?\??[-+=&;%@.\w_]*#?\w*)?)$/
  return regExp.test(value)
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isNunNull(value: unknown): value is null {
  return value !== null
}

export function isNullAndUndefined(val: unknown): val is null | undefined {
  return isUndefined(val) && isNull(val)
}

export function isNullOrUndefined(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val)
}

export function isEmpty<T>(value: T): value is T {
  if (isNull(value)) return true
  if (isObject(value)) {
    return Object.keys(value).length === 0
  }
  if ((value as any) instanceof Number) {
    return Number(value) === 0
  }
  if (isArray(value) || isString(value)) {
    return (value as any).length === 0
  }
  if ((value as any) instanceof Map || (value as any) instanceof Set) {
    return (value as any).size === 0
  }
  return false
}

export function isNotEmpty<T = unknown>(value: T): value is T {
  return !isEmpty(value)
}

export function deepClone<T = unknown>(target: T): T {
  return Lodash.cloneDeep(target)
}

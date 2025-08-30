// eslint-disable-next-line vue/prefer-import-from-vue
import { isFunction, isObject } from '@vue/shared';

/**
 * 检查传入的值是否为undefined。
 *
 * @param {unknown} value 要检查的值。
 * @returns {boolean} 如果值是undefined，返回true，否则返回false。
 */
function isUndefined(value?: unknown): value is undefined {
  return value === undefined;
}

function isType(value: unknown, type: string) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

function isDefined<T = unknown>(value?: T): value is T {
  return value !== undefined;
}

function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    isType(value, 'Promise') &&
    isObject(value) &&
    isFunction(value.then) &&
    isFunction(value.catch)
  );
}

function isString(value: unknown): value is string {
  return isType(value, 'String');
}

function isArray(value: any): value is Array<any> {
  return value && Array.isArray(value);
}

const isServer = typeof window === 'undefined';

const isClient = !isServer;

function isUrl(value: string): boolean {
  const regExp: RegExp =
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    /^(?:https?:(?:\/\/)?(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)(?:\/[+~%/.\w-]*)?(?:\/#\/)?(?:\/[+~%/.\w-]*)?\??[-+=&;%@.\w]*#?\w*$/;
  return regExp.test(value);
}

function isNull(value: unknown): value is null {
  return value === null;
}

function isNunNull(value: unknown): value is null {
  return value !== null;
}

function isNullAndUndefined(val: unknown): val is null | undefined {
  return isUndefined(val) && isNull(val);
}

function isNullOrUndefined(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val);
}

function isNotEmpty<T = unknown>(value: T): value is T {
  return !isEmpty(value);
}

/**
 * 检查传入的值是否为空。
 *
 * 以下情况将被认为是空：
 * - 值为null。
 * - 值为undefined。
 * - 值为一个空字符串。
 * - 值为一个长度为0的数组。
 * - 值为一个没有元素的Map或Set。
 * - 值为一个没有属性的对象。
 *
 * @param {T} value 要检查的值。
 * @returns {boolean} 如果值为空，返回true，否则返回false。
 */
function isEmpty<T>(value: T): value is T {
  if (isNull(value)) return true;
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }
  if (typeof (value as any) === 'number') {
    return Number(value) === 0;
  }
  if (isArray(value) || isString(value)) {
    return (value as any).length === 0;
  }
  if ((value as any) instanceof Map || (value as any) instanceof Set) {
    return (value as any).size === 0;
  }
  return false;
}

/**
 * 检查传入的字符串是否为有效的HTTP或HTTPS URL。
 *
 * @param {string} url 要检查的字符串。
 * @return {boolean} 如果字符串是有效的HTTP或HTTPS URL，返回true，否则返回false。
 */
function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}

/**
 * 检查传入的值是否为window对象。
 *
 * @param {any} value 要检查的值。
 * @returns {boolean} 如果值是window对象，返回true，否则返回false。
 */
function isWindow(value: any): value is Window {
  return (
    typeof window !== 'undefined' && value !== null && value === value.window
  );
}

/**
 * 检查当前运行环境是否为Mac OS。
 *
 * 这个函数通过检查navigator.userAgent字符串来判断当前运行环境。
 * 如果userAgent字符串中包含"macintosh"或"mac os x"（不区分大小写），则认为当前环境是Mac OS。
 *
 * @returns {boolean} 如果当前环境是Mac OS，返回true，否则返回false。
 */
function isMacOs(): boolean {
  const macRegex = /macintosh|mac os x/i;
  return macRegex.test(navigator.userAgent);
}

/**
 * 检查当前运行环境是否为Windows OS。
 *
 * 这个函数通过检查navigator.userAgent字符串来判断当前运行环境。
 * 如果userAgent字符串中包含"windows"或"win32"（不区分大小写），则认为当前环境是Windows OS。
 *
 * @returns {boolean} 如果当前环境是Windows OS，返回true，否则返回false。
 */
function isWindowsOs(): boolean {
  const windowsRegex = /windows|win32/i;
  return windowsRegex.test(navigator.userAgent);
}

/**
 * Returns the first value in the provided list that is neither `null` nor `undefined`.
 *
 * This function iterates over the input values and returns the first one that is
 * not strictly equal to `null` or `undefined`. If all values are either `null` or
 * `undefined`, it returns `undefined`.
 *
 * @template T - The type of the input values.
 * @param {...(T | null | undefined)[]} values - A list of values to evaluate.
 * @returns {T | undefined} - The first value that is not `null` or `undefined`, or `undefined` if none are found.
 *
 * @example
 * // Returns 42 because it is the first non-null, non-undefined value.
 * getFirstNonNullOrUndefined(undefined, null, 42, 'hello'); // 42
 *
 * @example
 * // Returns 'hello' because it is the first non-null, non-undefined value.
 * getFirstNonNullOrUndefined(null, undefined, 'hello', 123); // 'hello'
 *
 * @example
 * // Returns undefined because all values are either null or undefined.
 * getFirstNonNullOrUndefined(undefined, null); // undefined
 */
function getFirstNonNullOrUndefined<T>(
  ...values: (null | T | undefined)[]
): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

export {
  getFirstNonNullOrUndefined,
  isClient,
  isDefined,
  isHttpUrl,
  isMacOs,
  isNotEmpty,
  isNullAndUndefined,
  isNullOrUndefined,
  isNunNull,
  isPromise,
  isServer,
  isType,
  isUrl,
  isWindow,
  isWindowsOs,
};

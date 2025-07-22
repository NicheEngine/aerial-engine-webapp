import type { Ref } from 'vue'
import { getCurrentInstance, reactive, shallowRef, watchEffect } from 'vue'
import type { AttrsOptions } from 'attrs-hook'

const DEFAULT_EXCLUDE_KEYS = ['class', 'style']

const LISTENER_PREFIX = /^on[A-Z]/

export function entries<T>(obj: Recordable<T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]])
}

export function useAttrsHook(params: AttrsOptions = {}): Ref<Recordable> | object {
  const instance = getCurrentInstance()
  if (!instance) return {}

  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = params
  const attrs = shallowRef({})
  const allExcludeKeys = excludeKeys.concat(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : [])

  // Since attrs are not reactive, make it reactive instead of doing in `onUpdated` hook for better performance
  instance.attrs = reactive(instance.attrs)

  watchEffect(() => {
    attrs.value = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (!allExcludeKeys.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))) {
        acm[key] = val
      }
      return acm
    }, {} as Recordable)
  })
  return attrs
}

export default useAttrsHook

import { provide, inject, reactive, readonly as defineReadonly } from 'vue'
import type { InjectionKey } from 'vue'
import type { ContextOptions, ShallowUnwrap } from 'context-hook'

export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: ContextOptions = {},
) {
  const { readonly = true, provider = false, native = false } = options

  const state = reactive(context)
  const provideData = readonly ? defineReadonly(state) : state
  !provider && provide(key, native ? context : provideData)

  return {
    state,
  }
}

export function useContextHook<T>(key: InjectionKey<T>, native?: boolean): T

export function useContextHook<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any,
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {})
}

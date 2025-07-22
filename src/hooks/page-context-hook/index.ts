import type { InjectionKey } from 'vue'
import { createContext, useContextHook } from 'context-hook'
import type { PageContextProps } from 'page-context-hook'

const key: InjectionKey<PageContextProps> = Symbol()

export function createPageContext(context: PageContextProps) {
  return createContext<PageContextProps>(context, key, { native: true })
}

export function usePageContextHook() {
  return useContextHook<PageContextProps>(key)
}

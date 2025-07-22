import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { StoreDefinition, Store } from 'pinia'
import type {
  EasyplayerOptions,
  EasyplayerStore,
  EasyplayerContext,
  ContextValue,
  EasyplayerCallbacks,
} from 'easyplayer-store'
import store from '@/stores'

const storeId: string = 'easyplayer'

export const DEFAULT_CONTEXT_KEY = storeId

const storeOptions = (): EasyplayerStore => {
  const contextValue: ContextValue = reactive({
    instance: null,
    options: null,
    callbacks: null,
  })

  const context: EasyplayerContext = reactive({})

  function _initContext(contextKey: string = storeId): void {
    if (contextKey) {
      context[contextKey] = reactive(contextValue)
    }
  }

  function setInstance(instance: object, contextKey: string = storeId): void {
    if (contextKey && !context[contextKey]) {
      _initContext(contextKey)
    }
    context[contextKey].instance = instance
  }

  function getInstance(contextKey: string = storeId): object {
    return context[contextKey]?.instance
  }

  function setOptions(options: EasyplayerOptions, contextKey: string = storeId): void {
    if (contextKey && !context[contextKey]) {
      _initContext(contextKey)
    }
    context[contextKey].options = options
  }

  function getOptions(contextKey: string = storeId): EasyplayerOptions {
    return context[contextKey]?.options
  }

  function setCallbacks(callbacks: EasyplayerCallbacks, contextKey: string = storeId): void {
    if (contextKey && !context[contextKey]) {
      _initContext(contextKey)
    }
    context[contextKey].callbacks = callbacks
  }

  function getCallbacks(contextKey: string = storeId): EasyplayerCallbacks {
    return context[contextKey]?.callbacks
  }

  return {
    /* 持久化 */
    persist: false,
    context,
    setInstance,
    getInstance,
    setOptions,
    getOptions,
    setCallbacks,
    getCallbacks,
  } as EasyplayerStore
}

const easyplayerStore: StoreDefinition<
  string,
  Pick<EasyplayerStore, never>,
  Pick<EasyplayerStore, never>,
  Pick<EasyplayerStore, keyof EasyplayerStore>
> = defineStore(storeId, storeOptions)

export function useEasyplayerStore(): Store<
  string,
  Pick<EasyplayerStore, never>,
  Pick<EasyplayerStore, never>,
  Pick<EasyplayerStore, keyof EasyplayerStore>
> {
  return easyplayerStore(store)
}

export default easyplayerStore

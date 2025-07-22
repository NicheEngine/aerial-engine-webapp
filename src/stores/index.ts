import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const store = createPinia()

store.use(piniaPluginPersistedState)

export function setupStore(app: App<Element>) {
  app.use(store)
}

export default store

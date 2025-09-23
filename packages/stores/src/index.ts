import type { StoreOptions } from 'engine-store';
import type { Pinia } from 'pinia';

import type { App } from 'vue';

import { createPinia } from 'pinia';
import SecureLS from 'secure-ls';

// eslint-disable-next-line import/no-mutable-exports
let store: Pinia = createPinia();

export async function initStores(app: App<Element>, options: StoreOptions) {
  const { createPersistedState } = await import('pinia-plugin-persistedstate');
  const { namespace } = options;
  store = createPinia();
  const secureLS = new SecureLS({
    encodingType: 'aes',
    encryptionSecret: import.meta.env.VITE_APP_STORE_SECURE_KEY,
    isCompression: true,
    // @ts-ignore secure-ls does not have a type definition for this
    metaKey: `${namespace}-secure-meta`,
  });
  store.use(
    createPersistedState({
      // key $appName-$store.id
      key: (storeKey) => `${namespace}-${storeKey}`,
      storage: import.meta.env.DEV
        ? localStorage
        : {
            getItem(key) {
              return secureLS.get(key);
            },
            setItem(key, value) {
              secureLS.set(key, value);
            },
          },
    }),
  );
  app.use(store);
  return store;
}

export function resetAllStores() {
  if (!store) {
    console.error('Pinia is not installed');
    return;
  }
  const stores = (store as any)._s;
  for (const [_key, store] of stores) {
    store.$reset();
  }
}

export default store;

export * from './access-store';
export * from './tabbar-store';
export * from './user-store';
export { defineStore, storeToRefs } from 'pinia';

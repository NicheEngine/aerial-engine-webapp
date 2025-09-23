declare module 'engine-store' {
  export * from './index';
  export { default as store } from './index';
  export * from './modules';
  export { defineStore, storeToRefs } from 'pinia';

  export interface StoreOptions {
    namespace: string;
  }
}

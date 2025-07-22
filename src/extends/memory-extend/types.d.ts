declare module 'memory-extend' {
  export interface MemoryCache<V = any> {
    value?: V
    timeoutId?: ReturnType<typeof setTimeout>
    time?: number
    alive?: number
  }
  export { Memory } from './index.ts'
}
